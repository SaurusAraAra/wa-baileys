declare const generateLoginNode: (userJid: any, config: any) => any;
declare const generateRegistrationNode: ({ registrationId, signedPreKey, signedIdentityKey }: {
    registrationId: any;
    signedIdentityKey: any;
    signedPreKey: any;
}, config: any) => any;
declare const configureSuccessfulPairing: (stanza: any, { advSecretKey, signedIdentityKey, signalIdentities }: {
    advSecretKey: any;
    signalIdentities: any;
    signedIdentityKey: any;
}) => {
    creds: {
        account: any;
        me: {
            id: any;
            name: any;
            lid: any;
        };
        signalIdentities: any[];
        platform: any;
    };
    reply: {
        tag: string;
        attrs: {
            to: string;
            type: string;
            id: any;
        };
        content: {
            tag: string;
            attrs: {};
            content: {
                tag: string;
                attrs: {
                    'key-index': any;
                };
                content: any;
            }[];
        }[];
    };
};
declare const encodeSignedDeviceIdentity: (account: any, includeSignatureKey: any) => any;
export { generateLoginNode };
export { generateRegistrationNode };
export { configureSuccessfulPairing };
export { encodeSignedDeviceIdentity };
