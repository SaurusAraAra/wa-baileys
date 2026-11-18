declare const BufferJSON: {
    replacer: (k: any, value: any) => any;
    reviver: (_: any, value: any) => any;
};
declare const getKeyAuthor: (key: any, meId?: string) => any;
declare const isStringNullOrEmpty: (value: any) => boolean;
declare const writeRandomPadMax16: (msg: any) => any;
declare const unpadRandomMax16: (e: any) => Uint8Array<any>;
declare const generateParticipantHashV2: (participants: any) => string;
declare const encodeWAMessage: (message: any) => any;
declare const generateRegistrationId: () => number;
declare const encodeBigEndian: (e: any, t?: number) => Uint8Array<ArrayBuffer>;
declare const toNumber: (t: any) => any;
/** unix timestamp of a date in seconds */
declare const unixTimestampSeconds: (date?: Date) => number;
declare const debouncedTimeout: (intervalMs: number, task: any) => {
    start: (newIntervalMs: any, newTask: any) => void;
    cancel: () => void;
    setTask: (newTask: any) => any;
    setInterval: (newInterval: any) => any;
};
declare const delay: (ms: any) => Promise<any>;
declare const delayCancellable: (ms: any) => {
    delay: Promise<any>;
    cancel: () => void;
};
declare function promiseTimeout(ms: any, promise: any): Promise<any>;
declare const generateMessageIDV2: (userId: any) => string;
declare const generateMessageID: () => string;
declare function bindWaitForEvent(ev: any, event: any): (check: any, timeoutMs: any) => Promise<void>;
declare const bindWaitForConnectionUpdate: (ev: any) => (check: any, timeoutMs: any) => Promise<void>;
/**
 * utility that fetches latest baileys version from the master branch.
 * Use to ensure your WA connection is always on the latest version
 */
declare const fetchLatestBaileysVersion: (options?: {}) => Promise<{
    version: number[];
    isLatest: boolean;
    error?: undefined;
} | {
    version: number[];
    isLatest: boolean;
    error: any;
}>;
/**
 * A utility that fetches the latest web version of whatsapp.
 * Use to ensure your WA connection is always on the latest version
 */
declare const fetchLatestWaWebVersion: (options?: {}) => Promise<{
    error?: undefined;
    version: number[];
    isLatest: boolean;
} | {
    version: number[];
    isLatest: boolean;
    error: any;
}>;
/** unique message tag prefix for MD clients */
declare const generateMdTagPrefix: () => string;
/**
 * Given a type of receipt, returns what the new status of the message should be
 * @param type type from receipt
 */
declare const getStatusFromReceiptType: (type: any) => any;
/**
 * Stream errors generally provide a reason, map that to a baileys DisconnectReason
 * @param reason the string reason given, eg. "conflict"
 */
declare const getErrorCodeFromStreamError: (node: any) => {
    reason: any;
    statusCode: number;
};
declare const getCallStatusFromNode: ({ tag, attrs }: {
    attrs: any;
    tag: any;
}) => any;
declare const getCodeFromWSError: (error: any) => number;
/**
 * Is the given platform WA business
 * @param platform AuthenticationCreds.platform
 */
declare const isWABusinessPlatform: (platform: any) => boolean;
declare function trimUndefined(obj: any): any;
declare function bytesToCrockford(buffer: any): string;
declare function encodeNewsletterMessage(message: any): any;
export { promiseTimeout };
export { bindWaitForEvent };
export { trimUndefined };
export { bytesToCrockford };
export { encodeNewsletterMessage };
export { BufferJSON };
export { getKeyAuthor };
export { isStringNullOrEmpty };
export { writeRandomPadMax16 };
export { unpadRandomMax16 };
export { generateParticipantHashV2 };
export { encodeWAMessage };
export { generateRegistrationId };
export { encodeBigEndian };
export { toNumber };
export { unixTimestampSeconds };
export { debouncedTimeout };
export { delay };
export { delayCancellable };
export { generateMessageIDV2 };
export { generateMessageID };
export { bindWaitForConnectionUpdate };
export { fetchLatestBaileysVersion };
export { fetchLatestWaWebVersion };
export { generateMdTagPrefix };
export { getStatusFromReceiptType };
export { getErrorCodeFromStreamError };
export { getCallStatusFromNode };
export { getCodeFromWSError };
export { isWABusinessPlatform };
