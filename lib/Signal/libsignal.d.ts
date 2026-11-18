import * as lid_mapping_js_1 from './lid-mapping.js';
declare function makeLibSignalRepository(auth: any, logger: any, pnToLIDFunc: any): {
    decryptGroupMessage({ group, authorJid, msg }: {
        authorJid: any;
        group: any;
        msg: any;
    }): any;
    processSenderKeyDistributionMessage({ item, authorJid }: {
        authorJid: any;
        item: any;
    }): Promise<any>;
    decryptMessage({ jid, type, ciphertext }: {
        ciphertext: any;
        jid: any;
        type: any;
    }): Promise<any>;
    encryptMessage({ jid, data }: {
        data: any;
        jid: any;
    }): Promise<any>;
    encryptGroupMessage({ group, meId, data, resetSenderKey }: {
        data: any;
        group: any;
        meId: any;
        resetSenderKey: any;
    }): Promise<any>;
    getSenderKeyDistributionMessage({ group, meId }: {
        group: any;
        meId: any;
    }): Promise<any>;
    hasSenderKey({ group, meId }: {
        group: any;
        meId: any;
    }): Promise<boolean>;
    getSessionInfo(jid: any): Promise<{
        baseKey: Uint8Array<any>;
        registrationId: number;
    }>;
    injectE2ESession({ jid, session }: {
        jid: any;
        session: any;
    }): Promise<any>;
    jidToSignalProtocolAddress(jid: any): any;
    lidMapping: lid_mapping_js_1.LIDMappingStore;
    validateSession(jid: any): Promise<{
        exists: boolean;
        reason: string;
    } | {
        reason?: undefined;
        exists: boolean;
    }>;
    deleteSession(jids: any): Promise<any>;
    close(): void;
    migrateSession(fromJid: any, toJid: any): Promise<any>;
};
export { makeLibSignalRepository };
