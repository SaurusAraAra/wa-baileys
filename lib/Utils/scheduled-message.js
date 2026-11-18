

import * as crypto_1 from 'crypto';
import * as index_js_1 from '../WAProto/index.js';
const SCHEDULED_MSG_META_TYPE = 'scheduled_message';
const SCHEDULED_MSG_MAX_PER_CHAT = 30;
const SCHEDULED_MSG_MAX_MEDIA = 1;
const SCHEDULED_MSG_RESOURCE_LIMIT_NACK_CODE = 419;
const SCHEDULED_MSG_REVEAL_KEY_BYTES = 32;
const SCHEDULED_MSG_REVEAL_KEY_IV_BYTES = 12;
const SCHEDULED_MSG_REVEAL_KEY_RETENTION_DAYS = 30;
const SCHEDULED_MSG_TAG_BYTES = 16;
const SCHEDULED_MSG_WINDOW = Object.freeze({
    chat: { minSeconds: 600, maxSeconds: 1209600 },
    newsletter: { minSeconds: 600, maxSeconds: 2592000 }
});
const generateRevealKey = () => (0, crypto_1.randomBytes)(SCHEDULED_MSG_REVEAL_KEY_BYTES);

const generateRevealKeyId = () => (0, crypto_1.randomUUID)();

const encryptWithRevealKey = (plaintext, revealKey) => {
    const key = Buffer.from(revealKey);
    if (key.length !== SCHEDULED_MSG_REVEAL_KEY_BYTES) {
        throw new TypeError(`reveal key must be ${SCHEDULED_MSG_REVEAL_KEY_BYTES} bytes`);
    }
    const encIv = (0, crypto_1.randomBytes)(SCHEDULED_MSG_REVEAL_KEY_IV_BYTES);
    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', key, encIv);
    const body = Buffer.concat([cipher.update(Buffer.from(plaintext)), cipher.final()]);
    return { encIv, encPayload: Buffer.concat([body, cipher.getAuthTag()]) };
};

const decryptWithRevealKey = (encPayload, encIv, revealKey) => {
    const key = Buffer.from(revealKey);
    const payload = Buffer.from(encPayload);
    if (payload.length < SCHEDULED_MSG_TAG_BYTES) {
        throw new TypeError('encrypted payload is too short to carry an auth tag');
    }
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', key, Buffer.from(encIv));
    decipher.setAuthTag(payload.subarray(payload.length - SCHEDULED_MSG_TAG_BYTES));
    return Buffer.concat([
        decipher.update(payload.subarray(0, payload.length - SCHEDULED_MSG_TAG_BYTES)),
        decipher.final()
    ]);
};

const buildConditionalRevealMessage = ({ encPayload, encIv, revealKeyId }) => ({
    conditionalRevealMessage: {
        conditionalRevealMessageType: index_js_1.proto.Message.ConditionalRevealMessage.ConditionalRevealMessageType.SCHEDULED_MESSAGE,
        encPayload: Buffer.from(encPayload),
        encIv: Buffer.from(encIv),
        revealKeyId
    }
});

const encodeScheduledMessage = (message, revealKey = generateRevealKey()) => {
    const plaintext = index_js_1.proto.Message.encode(index_js_1.proto.Message.fromObject(message)).finish();
    const { encIv, encPayload } = encryptWithRevealKey(plaintext, revealKey);
    const revealKeyId = generateRevealKeyId();
    return {
        revealKey,
        revealKeyId,
        encIv,
        encPayload,
        message: buildConditionalRevealMessage({ encPayload, encIv, revealKeyId })
    };
};

const decodeScheduledMessage = (conditionalRevealMessage, revealKey) => {
    const inner = conditionalRevealMessage?.conditionalRevealMessage ?? conditionalRevealMessage;
    if (!inner?.encPayload || !inner?.encIv) {
        throw new TypeError('conditionalRevealMessage is missing encPayload or encIv');
    }
    return index_js_1.proto.Message.decode(decryptWithRevealKey(inner.encPayload, inner.encIv, revealKey));
};

const buildScheduledMsgMetaNode = ({ kind = 'schedule', scheduledTimestampS, revealKeyId, revealKey }) => {
    if (!revealKeyId) {
        throw new TypeError('revealKeyId is required');
    }
    if (kind === 'schedule' && !revealKey) {
        throw new TypeError('scheduling requires the reveal key');
    }
    const attrs = { type: SCHEDULED_MSG_META_TYPE };
    if (kind === 'schedule') {
        if (!Number.isFinite(Number(scheduledTimestampS))) {
            throw new TypeError('scheduledTimestampS must be a unix timestamp in seconds');
        }
        attrs.st = String(Math.floor(Number(scheduledTimestampS)));
    }
    return {
        tag: 'meta',
        attrs,
        content: [{
                tag: 'key',
                attrs: { rkid: revealKeyId },
                content: kind === 'schedule' ? Buffer.from(revealKey) : undefined
            }]
    };
};

const buildUnscheduleProtocolMessage = (key) => ({
    protocolMessage: {
        key,
        type: index_js_1.proto.Message.ProtocolMessage.Type.MESSAGE_UNSCHEDULE
    }
});

const isScheduledTimeValid = (scheduledTimestampS, nowSeconds = Math.floor(Date.now() / 1000), window = SCHEDULED_MSG_WINDOW.chat) => {
    const rounded = Math.floor(nowSeconds / 60) * 60;
    return scheduledTimestampS - rounded >= window.minSeconds && scheduledTimestampS - nowSeconds <= window.maxSeconds;
};


export { SCHEDULED_MSG_META_TYPE };
export { SCHEDULED_MSG_MAX_PER_CHAT };
export { SCHEDULED_MSG_MAX_MEDIA };
export { SCHEDULED_MSG_RESOURCE_LIMIT_NACK_CODE };
export { SCHEDULED_MSG_REVEAL_KEY_BYTES };
export { SCHEDULED_MSG_REVEAL_KEY_IV_BYTES };
export { SCHEDULED_MSG_REVEAL_KEY_RETENTION_DAYS };
export { SCHEDULED_MSG_TAG_BYTES };
export { SCHEDULED_MSG_WINDOW };
export { generateRevealKey };
export { generateRevealKeyId };
export { encryptWithRevealKey };
export { decryptWithRevealKey };
export { buildConditionalRevealMessage };
export { encodeScheduledMessage };
export { decodeScheduledMessage };
export { buildScheduledMsgMetaNode };
export { buildUnscheduleProtocolMessage };
export { isScheduledTimeValid };
