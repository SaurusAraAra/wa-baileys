import * as ciphertext_message_1 from './ciphertext-message.js';
declare class SenderKeyMessage extends ciphertext_message_1.CiphertextMessage {
    SIGNATURE_LENGTH: number;
    serialized: any;
    messageVersion: number;
    keyId: any;
    iteration: any;
    ciphertext: any;
    signature: any;
    constructor(keyId: any, iteration: any, ciphertext: any, signatureKey: any, serialized: any);
    getKeyId(): any;
    getIteration(): any;
    getCipherText(): any;
    verifySignature(signatureKey: any): void;
    getSignature(signatureKey: any, serialized: any): any;
    serialize(): any;
    getType(): number;
}
export { SenderKeyMessage };
