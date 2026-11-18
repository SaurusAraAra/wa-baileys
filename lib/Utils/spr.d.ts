declare const SPR_LIMITS: Readonly<{
    targets: 100;
    concurrency: 10;
    encryptConcurrency: 8;
    avatarBudgetMs: 10000;
    avatarHardCapMs: 14000;
    avatarFetchMs: 8000;
    cacheSize: 200;
}>;
declare const SPR_TEXT: Readonly<{
    publicDefault: "Pesan ini memiliki isi khusus untuk beberapa penerima.";
    templateDefault: "Halo {name}, ada pesan untukmu.";
    noTarget: "Tidak ada anggota yang bisa dijadikan target (bot tidak dihitung).";
    emptyPrivate: "Isi pesan privat kosong.";
    needGroup: "Perintah ini hanya untuk grup.";
    encryptFailed: "Enkripsi per-penerima gagal semua. Coba lagi sebentar lagi.";
}>;
/**
 * Buat sender key baru yang hanya hidup untuk satu pesan.
 * Karena kuncinya tidak pernah disimpan, hanya device yang diberi SKDM-nya
 * yang bisa membuka pesan grup ini.
 */
declare const createOneShotSenderKey: () => {
    keyId: number;
    /** Isi senderKeyDistributionMessage.axolotlSenderKeyDistributionMessage */
    distribution(): any;
    /** Enkripsi payload menjadi SenderKeyMessage (iterasi 0) */
    seal(plaintext: any): any;
};
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
declare function sPR(conn: any, jid: any, message: any, options?: {}): Promise<any>;
/**
 * Baca anggota grup yang layak jadi target: bot tidak dihitung, tanpa duplikat,
 * admin didahulukan, dipotong sesuai `limit`.
 */
declare function getSPRTargets(conn: any, groupJid: any, { limit, exclude }?: {
    exclude?: any[];
    limit?: 100;
}): Promise<{
    meta: any;
    targets: any[];
    total: number;
    overflow: number;
}>;
/**
 * Ambil foto profil beberapa orang sekaligus (konkuren, ada budget & hard cap).
 * @returns Map<user, imageMessage> (kunci: semua alias user orang tsb)
 */
declare function loadSPRAvatars(conn: any, people: any, { concurrency, budgetMs, hardCapMs, fetchMs }?: {
    budgetMs?: 10000;
    concurrency?: 10;
    fetchMs?: 8000;
    hardCapMs?: 14000;
}): Promise<Map<any, any>>;
/**
 * Anggota grup lain melihat `publicText`, `targetJid` melihat `privateText`
 * (dengan foto profilnya sendiri bila `avatar` aktif).
 */
declare function sPRPrivate(conn: any, groupJid: any, targetJid: any, { publicText, privateText, avatar, mentionTarget, ...relayOptions }?: {
    avatar?: boolean;
    mentionTarget?: boolean;
    publicText?: "Pesan ini memiliki isi khusus untuk beberapa penerima.";
}): Promise<{
    id: any;
    avatar: boolean;
}>;
/**
 * Kirim pesan yang dipersonalisasi ke tiap anggota: `{name}` jadi @mention
 * orang itu, lengkap dengan foto profilnya. Anggota di luar batas `limit`
 * melihat `publicText`.
 */
declare function sPRBroadcast(conn: any, groupJid: any, { template, publicText, limit, exclude, avatar, ...relayOptions }?: {
    avatar?: boolean;
    exclude?: any[];
    limit?: 100;
    template?: "Halo {name}, ada pesan untukmu.";
}): Promise<{
    id: any;
    targets: number;
    total: number;
    overflow: number;
    withAvatar: number;
}>;
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
