

import * as crypto_1 from 'crypto';
import * as curve from 'libsignal/src/curve.js';
import * as Defaults_1 from '../Defaults/index.js';
import * as whatsapp_rust_bridge_1 from 'whatsapp-rust-bridge';

const { subtle } = globalThis.crypto;
/** prefix version byte to the pub keys, required for some curve crypto functions */
const generateSignalPubKey = (pubKey) => pubKey.length === 33 ? pubKey : Buffer.concat([Defaults_1.KEY_BUNDLE_TYPE, pubKey]);

const Curve = {
    generateKeyPair: () => {
        const { pubKey, privKey } = curve.generateKeyPair();
        return {
            private: Buffer.from(privKey),
            public: Buffer.from(pubKey.slice(1))
        };
    },
    sharedKey: (privateKey, publicKey) => {
        const shared = curve.calculateAgreement(generateSignalPubKey(publicKey), privateKey);
        return Buffer.from(shared);
    },
    sign: (privateKey, buf) => curve.calculateSignature(privateKey, buf),
    verify: (pubKey, message, signature) => {
        try {
            curve.verifySignature(generateSignalPubKey(pubKey), message, signature);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
const signedKeyPair = (identityKeyPair, keyId) => {
    const preKey = Curve.generateKeyPair();
    const pubKey = generateSignalPubKey(preKey.public);
    const signature = Curve.sign(identityKeyPair.private, pubKey);
    return { keyPair: preKey, signature, keyId };
};

const GCM_TAG_LENGTH = 128 >> 3;
/**
 * encrypt AES 256 GCM;
 * where the tag tag is suffixed to the ciphertext
 * */
function aesEncryptGCM(plaintext, key, iv, additionalData) {
    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', key, iv);
    cipher.setAAD(additionalData);
    return Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);
}
/**
 * decrypt AES 256 GCM;
 * where the auth tag is suffixed to the ciphertext
 * */
function aesDecryptGCM(ciphertext, key, iv, additionalData) {
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', key, iv);
    const enc = ciphertext.slice(0, ciphertext.length - GCM_TAG_LENGTH);
    const tag = ciphertext.slice(ciphertext.length - GCM_TAG_LENGTH);
    decipher.setAAD(additionalData);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]);
}
function aesEncryptCTR(plaintext, key, iv) {
    const cipher = (0, crypto_1.createCipheriv)('aes-256-ctr', key, iv);
    return Buffer.concat([cipher.update(plaintext), cipher.final()]);
}
function aesDecryptCTR(ciphertext, key, iv) {
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-ctr', key, iv);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
/** decrypt AES 256 CBC; where the IV is prefixed to the buffer */
function aesDecrypt(buffer, key) {
    return aesDecryptWithIV(buffer.subarray(16), key, buffer.subarray(0, 16));
}
/** decrypt AES 256 CBC */
function aesDecryptWithIV(buffer, key, IV) {
    const aes = (0, crypto_1.createDecipheriv)('aes-256-cbc', key, IV);
    return Buffer.concat([aes.update(buffer), aes.final()]);
}
function aesEncrypt(buffer, key) {
    const IV = (0, crypto_1.randomBytes)(16);
    const aes = (0, crypto_1.createCipheriv)('aes-256-cbc', key, IV);
    return Buffer.concat([IV, aes.update(buffer), aes.final()]); // prefix IV to the buffer
}
function aesEncrypWithIV(buffer, key, IV) {
    const aes = (0, crypto_1.createCipheriv)('aes-256-cbc', key, IV);
    return Buffer.concat([aes.update(buffer), aes.final()]); // prefix IV to the buffer
}
function hmacSign(buffer, key, variant = 'sha256') {
    return (0, crypto_1.createHmac)(variant, key).update(buffer).digest();
}
function sha256(buffer) {
    return (0, crypto_1.createHash)('sha256').update(buffer).digest();
}
async function derivePairingCodeKey(pairingCode, salt) {
    const encoder = new TextEncoder();
    const pairingCodeBuffer = encoder.encode(pairingCode);
    const saltBuffer = new Uint8Array(salt instanceof Uint8Array ? salt : new Uint8Array(salt));
    const keyMaterial = await subtle.importKey('raw', pairingCodeBuffer, { name: 'PBKDF2' }, false, [
        'deriveBits'
    ]);
    const derivedBits = await subtle.deriveBits({
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 2 << 16,
        hash: 'SHA-256'
    }, keyMaterial, 32 * 8 // 32 bytes * 8 = 256 bits
    );
    return Buffer.from(derivedBits);
}

export { aesEncryptGCM };
export { aesDecryptGCM };
export { aesEncryptCTR };
export { aesDecryptCTR };
export { aesDecrypt };
export { aesDecryptWithIV };
export { aesEncrypt };
export { aesEncrypWithIV };
export { hmacSign };
export { sha256 };
export { derivePairingCodeKey };
export { generateSignalPubKey };
export { Curve };
export { signedKeyPair };
export { md5 } from 'whatsapp-rust-bridge';
export { hkdf } from 'whatsapp-rust-bridge';
