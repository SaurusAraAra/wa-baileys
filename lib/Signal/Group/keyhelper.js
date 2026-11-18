

import * as nodeCrypto from 'crypto';
import * as curve_1 from 'libsignal/src/curve.js';
function generateSenderKey() {
    return nodeCrypto.randomBytes(32);
}
function generateSenderKeyId() {
    return nodeCrypto.randomInt(2147483647);
}
function generateSenderSigningKey(key) {
    if (!key) {
        key = (0, curve_1.generateKeyPair)();
    }
    return {
        public: Buffer.from(key.pubKey),
        private: Buffer.from(key.privKey)
    };
}

export { generateSenderKey };
export { generateSenderKeyId };
export { generateSenderSigningKey };
