import * as sender_chain_key_1 from './sender-chain-key.js';
import * as sender_message_key_1 from './sender-message-key.js';
declare class SenderKeyState {
    MAX_MESSAGE_KEYS: number;
    senderKeyStateStructure: any;
    constructor(id: any, iteration: any, chainKey: any, signatureKeyPair: any, signatureKeyPublic: any, signatureKeyPrivate: any, senderKeyStateStructure: any);
    getKeyId(): any;
    getSenderChainKey(): sender_chain_key_1.SenderChainKey;
    setSenderChainKey(chainKey: any): void;
    getSigningKeyPublic(): any;
    getSigningKeyPrivate(): any;
    hasSenderMessageKey(iteration: any): any;
    addSenderMessageKey(senderMessageKey: any): void;
    removeSenderMessageKey(iteration: any): sender_message_key_1.SenderMessageKey;
    getStructure(): any;
}
export { SenderKeyState };
