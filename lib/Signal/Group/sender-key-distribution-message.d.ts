import * as ciphertext_message_1 from './ciphertext-message.js';
declare class SenderKeyDistributionMessage extends ciphertext_message_1.CiphertextMessage {
    serialized: any;
    id: any;
    iteration: any;
    chainKey: any;
    signatureKey: any;
    constructor(id: any, iteration: any, chainKey: any, signatureKey: any, serialized: any);
    intsToByteHighAndLow(highValue: any, lowValue: any): number;
    serialize(): any;
    getType(): number;
    getIteration(): any;
    getChainKey(): any;
    getSignatureKey(): any;
    getId(): any;
}
export { SenderKeyDistributionMessage };
