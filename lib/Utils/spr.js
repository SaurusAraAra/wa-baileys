import crypto_1 from 'crypto';
/**
 * SPR - Selective / Private Relay for sauruspro-bail
 *
 * Engine kirim pesan grup dengan kontrol siapa yang bisa membaca apa:
 *   - public   : membaca pesan umum (menerima sender key sekali pakai)
 *   - personal : membaca pesan khusus miliknya sendiri (enkripsi 1-lawan-1)
 *   - hidden   : tidak menerima apa-apa
 *
 * Fitur kirim-per-penerima (privat, broadcast {name}, foto profil per orang,
 * batas target, cache, timeout) diadaptasi dari plugin zapo-js (MIT).
 *
 * Maintained by Saurus / Dinonic.
 */

import * as boom_1 from '@hapi/boom';
import * as crypto_2 from './crypto.js';
import * as generics_1 from './generics.js';
import * as validate_connection_1 from './validate-connection.js';
import * as messages_1 from './messages.js';
import * as reporting_utils_1 from './reporting-utils.js';
import * as tc_token_utils_1 from './tc-token-utils.js';
import * as index_1 from '../WABinary/index.js';
/* -------------------------------------------------------------------------- */
/*  Konfigurasi & teks default                                                */
/* -------------------------------------------------------------------------- */
const SPR_LIMITS = Object.freeze({
    targets: 100,
    concurrency: 10,
    encryptConcurrency: 8,
    avatarBudgetMs: 10000,
    avatarHardCapMs: 14000,
    avatarFetchMs: 8000,
    cacheSize: 200
});
const SPR_TEXT = Object.freeze({
    publicDefault: 'Pesan ini memiliki isi khusus untuk beberapa penerima.',
    templateDefault: 'Halo {name}, ada pesan untukmu.',
    noTarget: 'Tidak ada anggota yang bisa dijadikan target (bot tidak dihitung).',
    emptyPrivate: 'Isi pesan privat kosong.',
    needGroup: 'Perintah ini hanya untuk grup.',
    encryptFailed: 'Enkripsi per-penerima gagal semua. Coba lagi sebentar lagi.'
});
/* -------------------------------------------------------------------------- */
/*  Utilitas kecil (safe / timeout / pool / cache)                            */
/* -------------------------------------------------------------------------- */
const attempt = async (task, fallback = null) => {
    try {
        return await task();
    }
    catch {
        return fallback;
    }
};
const withTimeout = async (promise, ms, fallback) => {
    let timer;
    const limit = new Promise((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
        timer.unref?.();
    });
    try {
        return await Promise.race([promise, limit]);
    }
    finally {
        clearTimeout(timer);
    }
};
const runPool = async (items, limit, task) => {
    const out = new Array(items.length);
    let cursor = 0;
    const worker = async () => {
        while (cursor < items.length) {
            const index = cursor++;
            out[index] = await attempt(() => task(items[index], index));
        }
    };
    await Promise.all(Array.from({ length: Math.min(Math.max(limit, 1), items.length) }, worker));
    return out;
};
const makeCache = (size) => {
    const store = new Map();
    return {
        has: (k) => store.has(k),
        get: (k) => store.get(k),
        set: (k, v) => {
            store.set(k, v);
            if (store.size > size)
                store.delete(store.keys().next().value);
            return v;
        }
    };
};
const avatarBytesCache = makeCache(SPR_LIMITS.cacheSize);
const avatarMediaCache = makeCache(SPR_LIMITS.cacheSize);
const userOf = (jid) => (jid ? (0, index_1.jidDecode)(String(jid))?.user || String(jid).split('@')[0].split(':')[0] : '');
/* -------------------------------------------------------------------------- */
/*  Sender key sekali pakai (Signal group cipher)                             */
/* -------------------------------------------------------------------------- */
const varint = (value) => {
    const out = [];
    let v = value >>> 0;
    while (v >= 0x80) {
        out.push((v & 0x7f) | 0x80);
        v >>>= 7;
    }
    out.push(v);
    return Buffer.from(out);
};
const fieldVarint = (field, value) => Buffer.concat([varint((field << 3) | 0), varint(value)]);
const fieldBytes = (field, bytes) => Buffer.concat([varint((field << 3) | 2), varint(bytes.length), bytes]);
const SIGNAL_VERSION = Buffer.from([0x33]);
/**
 * Buat sender key baru yang hanya hidup untuk satu pesan.
 * Karena kuncinya tidak pernah disimpan, hanya device yang diberi SKDM-nya
 * yang bisa membuka pesan grup ini.
 */
const createOneShotSenderKey = () => {
    const keyId = crypto_1.randomBytes(4).readUInt32BE(0) & 0x7fffffff;
    const chainKey = crypto_1.randomBytes(32);
    const pair = crypto_2.Curve.generateKeyPair();
    const signingPublic = Buffer.concat([Buffer.from([0x05]), Buffer.from(pair.public)]);
    const deriveCipher = () => {
        const seed = crypto_1.createHmac('sha256', chainKey).update(Buffer.from([0x01])).digest();
        const okm = Buffer.from(crypto_1.hkdfSync('sha256', seed, Buffer.alloc(32), 'WhisperGroup', 48));
        return { iv: okm.subarray(0, 16), key: okm.subarray(16, 48) };
    };
    return {
        keyId,
        /** Isi senderKeyDistributionMessage.axolotlSenderKeyDistributionMessage */
        distribution() {
            const body = Buffer.concat([
                fieldVarint(1, keyId),
                fieldVarint(2, 0),
                fieldBytes(3, chainKey),
                fieldBytes(4, signingPublic)
            ]);
            return Buffer.concat([SIGNAL_VERSION, body]);
        },
        /** Enkripsi payload menjadi SenderKeyMessage (iterasi 0) */
        seal(plaintext) {
            const { iv, key } = deriveCipher();
            const cipher = crypto_1.createCipheriv('aes-256-cbc', key, iv);
            const sealed = Buffer.concat([cipher.update(plaintext), cipher.final()]);
            const body = Buffer.concat([fieldVarint(1, keyId), fieldVarint(2, 0), fieldBytes(3, sealed)]);
            const signed = Buffer.concat([SIGNAL_VERSION, body]);
            const signature = Buffer.from(crypto_2.Curve.sign(pair.private, signed));
            return Buffer.concat([signed, signature]);
        }
    };
};

/* -------------------------------------------------------------------------- */
/*  Helper tipe pesan                                                         */
/* -------------------------------------------------------------------------- */
const mediaTypeOf = (m) => {
    if (!m)
        return '';
    if (m.imageMessage)
        return 'image';
    if (m.videoMessage)
        return m.videoMessage.gifPlayback ? 'gif' : 'video';
    if (m.audioMessage)
        return m.audioMessage.ptt ? 'ptt' : 'audio';
    if (m.contactMessage)
        return 'vcard';
    if (m.documentMessage)
        return 'document';
    if (m.contactsArrayMessage)
        return 'contact_array';
    if (m.liveLocationMessage)
        return 'livelocation';
    if (m.stickerMessage || m.stickerPackMessage)
        return 'sticker';
    if (m.listMessage)
        return 'list';
    if (m.listResponseMessage)
        return 'list_response';
    if (m.buttonsResponseMessage)
        return 'buttons_response';
    if (m.orderMessage)
        return 'order';
    if (m.productMessage)
        return 'product';
    if (m.interactiveResponseMessage)
        return 'native_flow_response';
    if (m.groupInviteMessage)
        return 'url';
    return '';
};
const stanzaTypeOf = (message) => {
    const m = (0, messages_1.normalizeMessageContent)(message);
    if (!m)
        return 'text';
    if (m.reactionMessage || m.encReactionMessage)
        return 'reaction';
    if (m.pollCreationMessage || m.pollCreationMessageV2 || m.pollCreationMessageV3 ||
        m.pollCreationMessageV4 || m.pollCreationMessageV5 || m.pollUpdateMessage)
        return 'poll';
    if (m.eventMessage)
        return 'event';
    return mediaTypeOf(m) ? 'media' : 'text';
};
const decryptFailHidden = (message, hide) => {
    const m = (0, messages_1.normalizeMessageContent)(message);
    return hide === true || !!(m?.pinInChatMessage || m?.reactionMessage);
};
/* -------------------------------------------------------------------------- */
/*  Identitas (PN <-> LID) dan pencocokan target                              */
/* -------------------------------------------------------------------------- */
const participantAliases = (p) => [p?.id, p?.jid, p?.lid, p?.phoneNumber, p?.pn].filter(Boolean).map(userOf).filter(Boolean);
/** Peta alias user -> himpunan semua alias user milik orang yang sama */
const buildAliasIndex = (groupData) => {
    const index = new Map();
    for (const p of groupData?.participants || []) {
        const set = new Set(participantAliases(p));
        for (const alias of set)
            index.set(alias, set);
    }
    return index;
};
const lookupMapped = async (conn, jid) => {
    const mapping = conn.signalRepository?.lidMapping;
    if (!mapping)
        return null;
    const decoded = (0, index_1.jidDecode)(jid);
    if (!decoded)
        return null;
    if (decoded.server === 's.whatsapp.net')
        return attempt(() => mapping.getLIDForPN(jid));
    if (decoded.server === 'lid')
        return attempt(() => mapping.getPNForLID(jid));
    return null;
};
/** Ubah daftar JID menjadi aturan {user, device|null} lengkap dengan alias PN/LID */
const buildRules = async (conn, list, aliasIndex) => {
    const rules = [];
    for (const raw of Array.isArray(list) ? list : []) {
        const decoded = raw ? (0, index_1.jidDecode)(raw) : null;
        if (!decoded)
            continue;
        const device = String(raw).includes(':') ? (decoded.device ?? 0) : null;
        const users = new Set([decoded.user, ...(aliasIndex.get(decoded.user) || [])]);
        const mapped = await lookupMapped(conn, raw);
        if (mapped)
            users.add(userOf(mapped));
        for (const user of users)
            rules.push({ user, device });
    }
    return rules;
};
const matchesRules = (deviceJid, rules) => {
    const d = (0, index_1.jidDecode)(deviceJid);
    if (!d)
        return false;
    const device = d.device ?? 0;
    return rules.some((r) => r.user === d.user && (r.device === null || r.device === device));
};
/**
 * Normalisasi opsi `personal` menjadi fungsi (deviceUser) -> message | null.
 * Bentuk yang diterima: function({jid,user}), Map, atau object {jid: message}.
 */
const buildPersonalResolver = async (conn, personal, aliasIndex) => {
    if (!personal)
        return () => null;
    if (typeof personal === 'function') {
        const memo = new Map();
        return (ctx) => {
            if (!memo.has(ctx.user))
                memo.set(ctx.user, personal(ctx) || null);
            return memo.get(ctx.user);
        };
    }
    const entries = personal instanceof Map ? [...personal.entries()] : Object.entries(personal);
    const byUser = new Map();
    for (const [jid, message] of entries) {
        if (!message)
            continue;
        const users = new Set([userOf(jid), ...(aliasIndex.get(userOf(jid)) || [])]);
        const mapped = await lookupMapped(conn, jid);
        if (mapped)
            users.add(userOf(mapped));
        for (const user of users)
            if (user)
                byUser.set(user, message);
    }
    return (ctx) => byUser.get(ctx.user) || null;
};
/* -------------------------------------------------------------------------- */
/*  Inti: sPR                                                                 */
/* -------------------------------------------------------------------------- */
const isHostedDevice = (device) => (0, index_1.isHostedLidUser)(device.jid) || (0, index_1.isHostedPnUser)(device.jid) || device.device === 99;
const runEncrypt = (conn, groups, extraFor) => runPool(groups, SPR_LIMITS.encryptConcurrency, async ({ jids, message, dsm }) => {
    const extra = extraFor(message);
    return conn.createParticipantNodes(jids, message, extra, dsm);
});
/**
 * Kirim pesan dengan kontrol audiens per device.
 *
 * @param conn    socket sauruspro-bail
 * @param jid     grup / chat / status@broadcast
 * @param message pesan publik (boleh null jika semua penerima punya pesan personal)
 * @param options
 *   mode            'exclude' (default) | 'include'  -> berlaku untuk pesan publik
 *   target          JID yang dikenai mode
 *   targetMe        true/false memaksa device milik sendiri menerima/tidak
 *   deviceMode      'all' | 'primary' | 'secondary'
 *   personal        function({jid,user}) | Map | {jid: message}  -> pesan khusus per orang.
 *                   Penerima personal TIDAK menerima pesan publik.
 *   hideDecryptFail sembunyikan placeholder gagal-dekripsi (default true)
 *   messageId, additionalAttributes, additionalNodes, useUserDevicesCache,
 *   useCachedGroupMetadata, statusJidList
 * @returns messageId
 */
async function sPR(conn, jid, message, options = {}) {
    let { messageId: msgId, additionalAttributes, additionalNodes, useUserDevicesCache, useCachedGroupMetadata, statusJidList, targetMe, mode = 'exclude', target = [], personal, hideDecryptFail = true, deviceMode = 'all' } = options;
    if (!jid)
        throw new boom_1.Boom('sPR: jid wajib diisi', { statusCode: 400 });
    if (!message && !personal)
        throw new boom_1.Boom('sPR: message atau personal wajib diisi', { statusCode: 400 });
    const creds = conn.authState?.creds;
    const meId = creds?.me?.id || conn.user?.id || '';
    const meLid = creds?.me?.lid || conn.user?.lid || '';
    const meUsers = new Set([userOf(meId), userOf(meLid)].filter(Boolean));
    const isSelfDevice = (deviceJid) => meUsers.has(userOf(deviceJid));
    const isSenderDevice = (deviceJid) => deviceJid === meId || (!!meLid && deviceJid === meLid);
    const statusJid = 'status@broadcast';
    const { server } = (0, index_1.jidDecode)(jid);
    // Newsletter & pesan peer tidak punya konsep audiens: serahkan ke relay biasa.
    if (server === 'newsletter' || additionalAttributes?.category === 'peer') {
        return conn.relayMessage(jid, message, { messageId: msgId, additionalAttributes, additionalNodes });
    }
    const isGroup = (0, index_1.isJidGroup)(jid);
    const isStatus = jid === statusJid;
    const isGroupOrStatus = isGroup || isStatus;
    const destinationJid = isStatus ? statusJid : jid;
    msgId = msgId || (0, generics_1.generateMessageIDV2)(meId);
    useUserDevicesCache = useUserDevicesCache !== false;
    useCachedGroupMetadata = useCachedGroupMetadata !== false && !isStatus;
    const baseExtra = {};
    if (decryptFailHidden(message, hideDecryptFail))
        baseExtra['decrypt-fail'] = 'hide';
    const publicMedia = mediaTypeOf((0, messages_1.normalizeMessageContent)(message));
    if (publicMedia)
        baseExtra.mediatype = publicMedia;
    const extraFor = (msg) => {
        const media = mediaTypeOf((0, messages_1.normalizeMessageContent)(msg));
        const extra = { ...baseExtra };
        if (media)
            extra.mediatype = media;
        else
            delete extra.mediatype;
        return extra;
    };
    /* ---------- kumpulkan device & grup ---------- */
    let groupData;
    let devices = [];
    if (isGroupOrStatus) {
        groupData = useCachedGroupMetadata && conn.cachedGroupMetadata ? await conn.cachedGroupMetadata(jid) : undefined;
        if (!(groupData && Array.isArray(groupData.participants)) && !isStatus)
            groupData = await conn.groupMetadata(jid);
        const ids = groupData ? groupData.participants.map((p) => p.id) : [];
        if (isStatus && statusJidList)
            ids.push(...statusJidList);
        if (groupData?.ephemeralDuration > 0) {
            additionalAttributes = { ...additionalAttributes, expiration: String(groupData.ephemeralDuration) };
        }
        devices = await conn.getUSyncDevices(ids, !!useUserDevicesCache, false);
        if (isGroup) {
            additionalAttributes = { ...additionalAttributes, addressing_mode: groupData?.addressingMode || 'lid' };
        }
    }
    else {
        const lidChat = (0, index_1.isLidUser)(jid) && meLid;
        const self = (0, index_1.jidEncode)(userOf(lidChat ? meLid : meId), lidChat ? 'lid' : 's.whatsapp.net');
        devices = await conn.getUSyncDevices([self, jid], true, false);
    }
    const aliasIndex = buildAliasIndex(groupData);
    const rules = await buildRules(conn, target, aliasIndex);
    const personalFor = await buildPersonalResolver(conn, personal, aliasIndex);
    /* ---------- klasifikasi tiap device ---------- */
    const publicDevices = [];
    const personalByUser = new Map(); // user -> { message, jids[] }
    for (const device of devices) {
        const deviceJid = device.jid;
        if (isSenderDevice(deviceJid))
            continue;
        const d = (0, index_1.jidDecode)(deviceJid);
        const deviceId = d?.device ?? 0;
        if (deviceMode === 'primary' && deviceId !== 0)
            continue;
        if (deviceMode === 'secondary' && deviceId === 0)
            continue;
        const mine = isSelfDevice(deviceJid);
        const own = mine && typeof targetMe === 'boolean' ? targetMe : null;
        if (own === false)
            continue;
        const personalMsg = own === null ? personalFor({ jid: deviceJid, user: d?.user }) : null;
        if (personalMsg) {
            const slot = personalByUser.get(d.user) || { message: personalMsg, jids: [] };
            slot.jids.push(deviceJid);
            personalByUser.set(d.user, slot);
            continue;
        }
        if (!message)
            continue;
        let allowed = mode === 'include' ? matchesRules(deviceJid, rules) : !matchesRules(deviceJid, rules);
        if (own !== null)
            allowed = own;
        if (allowed)
            publicDevices.push(deviceJid);
    }
    const publicRecipients = isGroupOrStatus
        ? publicDevices.filter((j) => !(0, index_1.isHostedLidUser)(j) && !(0, index_1.isHostedPnUser)(j))
        : publicDevices;
    const personalGroups = [...personalByUser.values()].map((slot) => ({
        jids: slot.jids,
        message: slot.message
    }));
    const personalRecipients = personalGroups.flatMap((g) => g.jids);
    await conn.assertSessions([...publicRecipients, ...personalRecipients]);
    /* ---------- enkripsi ---------- */
    const participantNodes = [];
    const content = [];
    let needsIdentity = false;
    let reportingSource = message;
    if (isGroupOrStatus) {
        if (message) {
            const patched = typeof conn.patchMessageBeforeSending === 'function'
                ? await conn.patchMessageBeforeSending(message)
                : message;
            if (Array.isArray(patched))
                throw new boom_1.Boom('Per-jid patching is not supported in groups');
            reportingSource = patched;
            const senderKey = createOneShotSenderKey();
            const skmsg = senderKey.seal((0, generics_1.encodeWAMessage)(patched));
            if (publicRecipients.length) {
                const skdm = {
                    senderKeyDistributionMessage: {
                        groupId: destinationJid,
                        axolotlSenderKeyDistributionMessage: senderKey.distribution()
                    }
                };
                const res = await conn.createParticipantNodes(publicRecipients, skdm, baseExtra);
                participantNodes.push(...res.nodes);
                needsIdentity ||= res.shouldIncludeDeviceIdentity;
            }
            content.push({ tag: 'enc', attrs: { v: '2', type: 'skmsg', ...baseExtra }, content: skmsg });
        }
        const results = await runEncrypt(conn, personalGroups, extraFor);
        for (const res of results) {
            if (!res)
                continue;
            participantNodes.push(...res.nodes);
            needsIdentity ||= res.shouldIncludeDeviceIdentity;
        }
        if (personalGroups.length && !results.some((r) => r?.nodes?.length) && !publicRecipients.length) {
            throw new boom_1.Boom(SPR_TEXT.encryptFailed, { statusCode: 500 });
        }
    }
    else {
        const meDsm = (msg) => ({
            deviceSentMessage: { destinationJid, message: msg },
            messageContextInfo: msg?.messageContextInfo
        });
        const groups = [];
        if (message && publicRecipients.length) {
            groups.push({ jids: publicRecipients, message, dsm: meDsm(message) });
        }
        for (const g of personalGroups)
            groups.push({ ...g, dsm: meDsm(g.message) });
        const results = await runEncrypt(conn, groups, extraFor);
        for (const res of results) {
            if (!res)
                continue;
            participantNodes.push(...res.nodes);
            needsIdentity ||= res.shouldIncludeDeviceIdentity;
        }
        if (groups.length && !participantNodes.length) {
            throw new boom_1.Boom(SPR_TEXT.encryptFailed, { statusCode: 500 });
        }
        if (participantNodes.length) {
            additionalAttributes = {
                ...additionalAttributes,
                phash: (0, generics_1.generateParticipantHashV2)([...publicRecipients, ...personalRecipients])
            };
        }
    }
    if (!participantNodes.length && !content.length) {
        throw new boom_1.Boom('sPR: tidak ada penerima yang cocok', { statusCode: 400 });
    }
    if (participantNodes.length)
        content.unshift({ tag: 'participants', attrs: {}, content: participantNodes });
    /* ---------- susun stanza ---------- */
    const typeSource = message || personalGroups[0]?.message;
    const stanza = {
        tag: 'message',
        attrs: { id: msgId, to: destinationJid, type: stanzaTypeOf(typeSource), ...(additionalAttributes || {}) },
        content
    };
    if (needsIdentity && creds?.account) {
        stanza.content.push({ tag: 'device-identity', attrs: {}, content: (0, validate_connection_1.encodeSignedDeviceIdentity)(creds.account, true) });
    }
    const hasReportingNode = additionalNodes?.some((n) => n.tag === 'reporting');
    if (message && reportingSource?.messageContextInfo?.messageSecret && (0, reporting_utils_1.shouldIncludeReportingToken)(reportingSource) && !hasReportingNode) {
        const node = await attempt(() => (0, reporting_utils_1.getMessageReportingToken)((0, generics_1.encodeWAMessage)(reportingSource), reportingSource, {
            id: msgId,
            fromMe: true,
            remoteJid: destinationJid
        }));
        if (node)
            stanza.content.push(node);
    }
    if (!isGroupOrStatus) {
        const tcJid = await attempt(() => (0, tc_token_utils_1.resolveTcTokenJid)(destinationJid, (pn) => conn.signalRepository?.lidMapping?.getLIDForPN(pn)), destinationJid);
        const entry = (await attempt(() => conn.authState.keys.get('tctoken', [tcJid]), {}))?.[tcJid];
        if (entry?.token?.length && !(0, tc_token_utils_1.isTcTokenExpired)(entry.timestamp)) {
            stanza.content.push({ tag: 'tctoken', attrs: {}, content: entry.token });
        }
    }
    if (additionalNodes?.length)
        stanza.content.push(...additionalNodes);
    await conn.sendNode(stanza);
    return msgId;
}

/* -------------------------------------------------------------------------- */
/*  Anggota grup (adaptasi readMembers zapo)                                  */
/* -------------------------------------------------------------------------- */
/**
 * Baca anggota grup yang layak jadi target: bot tidak dihitung, tanpa duplikat,
 * admin didahulukan, dipotong sesuai `limit`.
 */
async function getSPRTargets(conn, groupJid, { limit = SPR_LIMITS.targets, exclude = [] } = {}) {
    const meta = await conn.groupMetadata(groupJid);
    const creds = conn.authState?.creds;
    const skip = new Set([creds?.me?.id, creds?.me?.lid, conn.user?.id, conn.user?.lid, ...exclude].filter(Boolean).map(userOf));
    const seen = new Set();
    const members = [];
    for (const p of meta?.participants || []) {
        const aliases = participantAliases(p);
        if (!aliases.length || aliases.some((a) => skip.has(a) || seen.has(a)))
            continue;
        aliases.forEach((a) => seen.add(a));
        members.push(p);
    }
    const rank = (p) => (p.admin === 'superadmin' ? 0 : p.admin ? 1 : 2);
    const ordered = [...members].sort((a, b) => rank(a) - rank(b));
    const targets = ordered.slice(0, Math.max(0, limit));
    return { meta, targets, total: members.length, overflow: Math.max(0, members.length - targets.length) };
}
/* -------------------------------------------------------------------------- */
/*  Foto profil per penerima (adaptasi avatar loader zapo)                    */
/* -------------------------------------------------------------------------- */
const fetchAvatarBytes = async (url, timeoutMs) => {
    if (!url)
        return null;
    if (avatarBytesCache.has(url))
        return avatarBytesCache.get(url);
    return attempt(async () => {
        const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok)
            return null;
        const bytes = Buffer.from(await res.arrayBuffer());
        return bytes.length ? avatarBytesCache.set(url, bytes) : null;
    });
};
const uploadAvatar = async (conn, bytes) => {
    if (!bytes?.length || typeof conn.waUploadToServer !== 'function')
        return null;
    const hash = crypto_1.createHash('md5').update(bytes).digest('hex');
    if (avatarMediaCache.has(hash))
        return avatarMediaCache.get(hash);
    return attempt(async () => {
        const prepared = await (0, messages_1.prepareWAMessageMedia)({ image: bytes }, { upload: conn.waUploadToServer, logger: conn.logger });
        return prepared?.imageMessage ? avatarMediaCache.set(hash, prepared.imageMessage) : null;
    });
};
const avatarUrlOf = async (conn, person) => {
    const candidates = [person.id, person.phoneNumber, person.pn, person.lid, person.jid].filter(Boolean);
    for (const candidate of [...new Set(candidates)]) {
        const url = await attempt(() => conn.profilePictureUrl(candidate, 'image'));
        if (url)
            return url;
    }
    return null;
};
/**
 * Ambil foto profil beberapa orang sekaligus (konkuren, ada budget & hard cap).
 * @returns Map<user, imageMessage> (kunci: semua alias user orang tsb)
 */
async function loadSPRAvatars(conn, people, { concurrency = SPR_LIMITS.concurrency, budgetMs = SPR_LIMITS.avatarBudgetMs, hardCapMs = SPR_LIMITS.avatarHardCapMs, fetchMs = SPR_LIMITS.avatarFetchMs } = {}) {
    const map = new Map();
    if (typeof conn.profilePictureUrl !== 'function')
        return map;
    const started = Date.now();
    const job = async () => {
        const rows = await runPool(people, concurrency, async (person) => {
            if (Date.now() - started > budgetMs)
                return null;
            const url = await avatarUrlOf(conn, person);
            const image = await uploadAvatar(conn, await fetchAvatarBytes(url, fetchMs));
            return image ? { keys: participantAliases(person), image } : null;
        });
        for (const row of rows) {
            if (row)
                for (const key of row.keys)
                    map.set(key, row.image);
        }
        return map;
    };
    await withTimeout(attempt(job), hardCapMs, null);
    return map;
}
;
/* -------------------------------------------------------------------------- */
/*  Pesan personal (gambar profil + caption + mention)                        */
/* -------------------------------------------------------------------------- */
const personalMessage = (image, caption, mentions) => {
    const contextInfo = { mentionedJid: mentions };
    return image
        ? { imageMessage: { ...image, caption, contextInfo } }
        : { extendedTextMessage: { text: caption, contextInfo } };
};
/* -------------------------------------------------------------------------- */
/*  sPRPrivate  (setara `!spr publik | privat` di plugin zapo)                */
/* -------------------------------------------------------------------------- */
/**
 * Anggota grup lain melihat `publicText`, `targetJid` melihat `privateText`
 * (dengan foto profilnya sendiri bila `avatar` aktif).
 */
async function sPRPrivate(conn, groupJid, targetJid, { publicText = SPR_TEXT.publicDefault, privateText, avatar = true, mentionTarget = false, ...relayOptions } = {}) {
    if (!(0, index_1.isJidGroup)(groupJid))
        throw new boom_1.Boom(SPR_TEXT.needGroup, { statusCode: 400 });
    if (!targetJid)
        throw new boom_1.Boom('sPRPrivate: targetJid wajib diisi', { statusCode: 400 });
    if (!privateText?.trim())
        throw new boom_1.Boom(SPR_TEXT.emptyPrivate, { statusCode: 400 });
    let image = null;
    if (avatar) {
        const avatars = await loadSPRAvatars(conn, [{ id: targetJid }]);
        image = avatars.get(userOf(targetJid)) || null;
    }
    const mentions = mentionTarget ? [targetJid] : [];
    const id = await sPR(conn, groupJid, { extendedTextMessage: { text: publicText, contextInfo: { mentionedJid: [] } } }, {
        ...relayOptions,
        personal: new Map([[targetJid, personalMessage(image, privateText, mentions)]])
    });
    return { id, avatar: !!image };
}
/* -------------------------------------------------------------------------- */
/*  sPRBroadcast  (setara `!sbpr` / `!sbrp`)                                   */
/* -------------------------------------------------------------------------- */
/**
 * Kirim pesan yang dipersonalisasi ke tiap anggota: `{name}` jadi @mention
 * orang itu, lengkap dengan foto profilnya. Anggota di luar batas `limit`
 * melihat `publicText`.
 */
async function sPRBroadcast(conn, groupJid, { template = SPR_TEXT.templateDefault, publicText, limit = SPR_LIMITS.targets, exclude = [], avatar = true, ...relayOptions } = {}) {
    if (!(0, index_1.isJidGroup)(groupJid))
        throw new boom_1.Boom(SPR_TEXT.needGroup, { statusCode: 400 });
    const info = await getSPRTargets(conn, groupJid, { limit, exclude });
    if (!info.targets.length)
        throw new boom_1.Boom(SPR_TEXT.noTarget, { statusCode: 400 });
    const text = template || SPR_TEXT.templateDefault;
    const hasSlot = text.includes('{name}');
    const avatars = avatar ? await loadSPRAvatars(conn, info.targets) : new Map();
    const personal = new Map();
    let withAvatar = 0;
    for (const person of info.targets) {
        const id = person.id || person.jid;
        const anchor = `@${userOf(id)}`;
        const caption = hasSlot ? text.replaceAll('{name}', anchor) : `${anchor} ${text}`;
        const image = avatars.get(userOf(id)) || null;
        if (image)
            withAvatar++;
        personal.set(id, personalMessage(image, caption, [id]));
    }
    const pub = publicText || text.replaceAll('{name}', 'semua');
    const id = await sPR(conn, groupJid, { extendedTextMessage: { text: pub, contextInfo: { mentionedJid: [] } } }, {
        ...relayOptions,
        personal
    });
    return { id, targets: info.targets.length, total: info.total, overflow: info.overflow, withAvatar };
}


export { sPR };
export { getSPRTargets };
export { loadSPRAvatars };
export { sPRPrivate };
export { sPRBroadcast };
export { SPR_LIMITS };
export { SPR_TEXT };
export { createOneShotSenderKey };
export { sPR as selectiveRelay };
export { sPR as default };
