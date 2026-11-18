

import * as crypto_1 from 'libsignal/src/crypto.js';
import * as sender_message_key_1 from './sender-message-key.js';
class SenderChainKey {
    constructor(iteration, chainKey) {
        this.MESSAGE_KEY_SEED = Buffer.from([0x01]);
        this.CHAIN_KEY_SEED = Buffer.from([0x02]);
        this.iteration = iteration;
        this.chainKey = Buffer.from(chainKey);
    }
    getIteration() {
        return this.iteration;
    }
    getSenderMessageKey() {
        return new sender_message_key_1.SenderMessageKey(this.iteration, this.getDerivative(this.MESSAGE_KEY_SEED, this.chainKey));
    }
    getNext() {
        return new SenderChainKey(this.iteration + 1, this.getDerivative(this.CHAIN_KEY_SEED, this.chainKey));
    }
    getSeed() {
        return this.chainKey;
    }
    getDerivative(seed, key) {
        return (0, crypto_1.calculateMAC)(key, seed);
    }
}


export { SenderChainKey };
