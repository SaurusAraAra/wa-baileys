declare const SCHEDULED_MSG_META_TYPE = "scheduled_message";
declare const SCHEDULED_MSG_MAX_PER_CHAT = 30;
declare const SCHEDULED_MSG_MAX_MEDIA = 1;
declare const SCHEDULED_MSG_RESOURCE_LIMIT_NACK_CODE = 419;
declare const SCHEDULED_MSG_REVEAL_KEY_BYTES = 32;
declare const SCHEDULED_MSG_REVEAL_KEY_IV_BYTES = 12;
declare const SCHEDULED_MSG_REVEAL_KEY_RETENTION_DAYS = 30;
declare const SCHEDULED_MSG_TAG_BYTES = 16;
declare const SCHEDULED_MSG_WINDOW: Readonly<{
    chat: {
        minSeconds: number;
        maxSeconds: number;
    };
    newsletter: {
        minSeconds: number;
        maxSeconds: number;
    };
}>;
declare const generateRevealKey: () => any;
declare const generateRevealKeyId: () => any;
declare const encryptWithRevealKey: (plaintext: any, revealKey: any) => {
    encIv: any;
    encPayload: any;
};
declare const decryptWithRevealKey: (encPayload: any, encIv: any, revealKey: any) => any;
declare const buildConditionalRevealMessage: ({ encPayload, encIv, revealKeyId }: {
    encIv: any;
    encPayload: any;
    revealKeyId: any;
}) => {
    conditionalRevealMessage: {
        conditionalRevealMessageType: any;
        encPayload: any;
        encIv: any;
        revealKeyId: any;
    };
};
declare const encodeScheduledMessage: (message: any, revealKey?: any) => {
    revealKey: any;
    revealKeyId: any;
    encIv: any;
    encPayload: any;
    message: {
        conditionalRevealMessage: {
            conditionalRevealMessageType: any;
            encPayload: any;
            encIv: any;
            revealKeyId: any;
        };
    };
};
declare const decodeScheduledMessage: (conditionalRevealMessage: any, revealKey: any) => any;
declare const buildScheduledMsgMetaNode: ({ kind, scheduledTimestampS, revealKeyId, revealKey }: {
    kind?: string;
    revealKey: any;
    revealKeyId: any;
    scheduledTimestampS: any;
}) => {
    tag: string;
    attrs: {
        type: string;
    };
    content: {
        tag: string;
        attrs: {
            rkid: any;
        };
        content: any;
    }[];
};
declare const buildUnscheduleProtocolMessage: (key: any) => {
    protocolMessage: {
        key: any;
        type: any;
    };
};
declare const isScheduledTimeValid: (scheduledTimestampS: any, nowSeconds?: number, window?: {
    minSeconds: number;
    maxSeconds: number;
}) => boolean;
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
