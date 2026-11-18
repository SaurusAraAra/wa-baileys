declare const getDecryptionJid: (sender: any, repository: any) => Promise<any>;
declare const NO_MESSAGE_FOUND_ERROR_TEXT = "Message absent from node";
declare const MISSING_KEYS_ERROR_TEXT = "Key used already or never filled";
declare const ACCOUNT_RESTRICTED_TEXT = "Your account has been restricted";
declare const DECRYPTION_RETRY_CONFIG: {
    maxRetries: number;
    baseDelayMs: number;
    sessionRecordErrors: string[];
};
/** NACK reason codes we send to the server (client → server) */
declare const NACK_REASONS: {
    SenderReachoutTimelocked: number;
    ParsingError: number;
    UnrecognizedStanza: number;
    UnrecognizedStanzaClass: number;
    UnrecognizedStanzaType: number;
    InvalidProtobuf: number;
    InvalidHostedCompanionStanza: number;
    MissingMessageSecret: number;
    SignalErrorOldCounter: number;
    MessageDeletedOnPeer: number;
    UnhandledError: number;
    UnsupportedAdminRevoke: number;
    UnsupportedLIDGroup: number;
    DBOperationFailed: number;
};
/**
 * Server-side error codes returned in ack stanzas (server → client) that we
 * currently have dedicated handlers for. Extend as more handlers are added.
 * Distinct from the client-side NackReason enum (WAWebCreateNackFromStanza).
 */
declare const SERVER_ERROR_CODES: {
    /**
     * 1:1 message missing privacy token (tctoken). Usually means the account is
     * restricted: WhatsApp blocks starting new chats but preserves existing ones,
     * since established chats already carry a tctoken.
     */
    MessageAccountRestriction: string;
    /** Stanza validation failure (SMAX_INVALID) — likely stale device session */
    SmaxInvalid: string;
};
declare const extractAddressingContext: (stanza: any) => {
    addressingMode: any;
    senderAlt: any;
    recipientAlt: any;
};
/**
 * Decode the received node as a message.
 * @note this will only parse the message, not decrypt it
 */
declare function decodeMessageNode(stanza: any, meId: any, meLid: any): {
    fullMessage: {
        key: {
            remoteJid: any;
            remoteJidAlt: any;
            remoteJidUsername: any;
            fromMe: boolean;
            id: any;
            participant: any;
            participantAlt: any;
            participantUsername: any;
            addressingMode: any;
            server_id?: any;
        };
        category: any;
        messageTimestamp: number;
        pushName: any;
        broadcast: any;
    };
    author: any;
    sender: any;
};
declare const decryptMessageNode: (stanza: any, meId: any, meLid: any, repository: any, logger: any) => {
    fullMessage: {
        key: {
            remoteJid: any;
            remoteJidAlt: any;
            remoteJidUsername: any;
            fromMe: boolean;
            id: any;
            participant: any;
            participantAlt: any;
            participantUsername: any;
            addressingMode: any;
            server_id?: any;
        };
        category: any;
        messageTimestamp: number;
        pushName: any;
        broadcast: any;
    };
    category: any;
    author: any;
    decrypt(): Promise<void>;
};
export { decodeMessageNode };
export { getDecryptionJid };
export { NO_MESSAGE_FOUND_ERROR_TEXT };
export { MISSING_KEYS_ERROR_TEXT };
export { ACCOUNT_RESTRICTED_TEXT };
export { DECRYPTION_RETRY_CONFIG };
export { NACK_REASONS };
export { SERVER_ERROR_CODES };
export { extractAddressingContext };
export { decryptMessageNode };
