import * as sender_message_key_1 from './sender-message-key.js';
declare class SenderChainKey {
    MESSAGE_KEY_SEED: any;
    CHAIN_KEY_SEED: any;
    iteration: any;
    chainKey: any;
    constructor(iteration: any, chainKey: any);
    getIteration(): any;
    getSenderMessageKey(): sender_message_key_1.SenderMessageKey;
    getNext(): SenderChainKey;
    getSeed(): any;
    getDerivative(seed: any, key: any): any;
}
export { SenderChainKey };
