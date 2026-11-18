/** prefix version byte to the pub keys, required for some curve crypto functions */
declare const generateSignalPubKey: (pubKey: any) => any;
declare const Curve: {
    generateKeyPair: () => {
        private: any;
        public: any;
    };
    sharedKey: (privateKey: any, publicKey: any) => any;
    sign: (privateKey: any, buf: any) => any;
    verify: (pubKey: any, message: any, signature: any) => boolean;
};
declare const signedKeyPair: (identityKeyPair: any, keyId: any) => {
    keyPair: {
        private: any;
        public: any;
    };
    signature: any;
    keyId: any;
};
/**
 * encrypt AES 256 GCM;
 * where the tag tag is suffixed to the ciphertext
 * */
declare function aesEncryptGCM(plaintext: any, key: any, iv: any, additionalData: any): any;
/**
 * decrypt AES 256 GCM;
 * where the auth tag is suffixed to the ciphertext
 * */
declare function aesDecryptGCM(ciphertext: any, key: any, iv: any, additionalData: any): any;
declare function aesEncryptCTR(plaintext: any, key: any, iv: any): any;
declare function aesDecryptCTR(ciphertext: any, key: any, iv: any): any;
/** decrypt AES 256 CBC; where the IV is prefixed to the buffer */
declare function aesDecrypt(buffer: any, key: any): any;
/** decrypt AES 256 CBC */
declare function aesDecryptWithIV(buffer: any, key: any, IV: any): any;
declare function aesEncrypt(buffer: any, key: any): any;
declare function aesEncrypWithIV(buffer: any, key: any, IV: any): any;
declare function hmacSign(buffer: any, key: any, variant?: string): any;
declare function sha256(buffer: any): any;
declare function derivePairingCodeKey(pairingCode: any, salt: any): Promise<any>;
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
