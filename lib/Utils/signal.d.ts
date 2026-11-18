declare const createSignalIdentity: (wid: any, accountSignatureKey: any) => {
    identifier: {
        name: any;
        deviceId: number;
    };
    identifierKey: any;
};
declare const getPreKeys: ({ get }: {
    get: any;
}, min: any, limit: any) => Promise<any>;
declare const generateOrGetPreKeys: (creds: any, range: any) => {
    newPreKeys: {};
    lastPreKeyId: number;
    preKeysRange: any[];
};
declare const xmppSignedPreKey: (key: any) => {
    tag: string;
    attrs: {};
    content: {
        tag: string;
        attrs: {};
        content: any;
    }[];
};
declare const xmppPreKey: (pair: any, id: any) => {
    tag: string;
    attrs: {};
    content: {
        tag: string;
        attrs: {};
        content: any;
    }[];
};
declare const extractE2ESessionFromRetryReceipt: (receipt: any) => {
    registrationId: number;
    identityKey: any;
    signedPreKey: {
        keyId: number;
        publicKey: any;
        signature: any;
    };
    preKey: any;
};
declare const parseAndInjectE2ESessions: (node: any, repository: any) => Promise<void>;
declare const extractDeviceJids: (result: any, myJid: any, myLid: any, excludeZeroDevices: any) => any[];
/**
 * get the next N keys for upload or processing
 * @param count number of pre-keys to get or generate
 */
declare const getNextPreKeys: ({ creds, keys }: {
    creds: any;
    keys: any;
}, count: any) => Promise<{
    update: {
        nextPreKeyId: number;
        firstUnuploadedPreKeyId: number;
    };
    preKeys: any;
}>;
declare const getNextPreKeysNode: (state: any, count: any) => Promise<{
    update: {
        nextPreKeyId: number;
        firstUnuploadedPreKeyId: number;
    };
    node: {
        tag: string;
        attrs: {
            xmlns: string;
            type: string;
            to: string;
        };
        content: {
            tag: string;
            attrs: {};
            content: any;
        }[];
    };
}>;
export { createSignalIdentity };
export { getPreKeys };
export { generateOrGetPreKeys };
export { xmppSignedPreKey };
export { xmppPreKey };
export { extractE2ESessionFromRetryReceipt };
export { parseAndInjectE2ESessions };
export { extractDeviceJids };
export { getNextPreKeys };
export { getNextPreKeysNode };
