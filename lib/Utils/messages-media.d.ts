declare const hkdfInfoKey: (type: any) => string;
declare const getRawMediaUploadData: (media: any, mediaType: any, logger: any) => Promise<{
    filePath: any;
    fileSha256: any;
    fileLength: number;
}>;
/** generates all the keys required to encrypt/decrypt & sign a media message */
declare function getMediaKeys(buffer: any, mediaType: any): Promise<{
    iv: any;
    cipherKey: any;
    macKey: any;
}>;
declare const extractImageThumb: (bufferOrFilePath: any, width?: number) => Promise<{
    buffer: any;
    original: {
        width: any;
        height: any;
    };
}>;
declare const encodeBase64EncodedStringForUpload: (b64: any) => string;
declare const generateProfilePicture: (mediaUpload: any, dimensions: any) => Promise<{
    img: any;
}>;
/** gets the SHA256 of the given media message */
declare const mediaMessageSHA256B64: (message: any) => any;
declare function getAudioDuration(buffer: any): Promise<any>;
/**
  referenced from and modifying https://github.com/wppconnect-team/wa-js/blob/main/src/chat/functions/prepareAudioWaveform.ts
 */
declare function getAudioWaveform(buffer: any, logger: any): Promise<Uint8Array<ArrayBuffer>>;
declare const toReadable: (buffer: any) => any;
declare const toBuffer: (stream: any) => Promise<any>;
declare const getStream: (item: any, opts: any) => Promise<{
    stream: any;
    type: string;
}>;
/** generates a thumbnail for a given media, if required */
declare function generateThumbnail(file: any, mediaType: any, options: any): Promise<{
    thumbnail: any;
    originalImageDimensions: any;
}>;
declare const getHttpStream: (url: any, options?: {}) => Promise<any>;
declare const encryptedStream: (media: any, mediaType: any, { logger, saveOriginalFileIfRequired, opts }?: {}) => Promise<{
    mediaKey: any;
    originalFilePath: any;
    encFilePath: any;
    mac: any;
    fileEncSha256: any;
    fileSha256: any;
    fileLength: number;
}>;
declare const DEF_MEDIA_HOST = "mmg.whatsapp.net";
declare const getUrlFromDirectPath: (directPath: any, host?: string) => string;
declare const downloadContentFromMessage: ({ mediaKey, directPath, url }: {
    directPath: any;
    mediaKey: any;
    url: any;
}, type: any, opts?: {}) => Promise<any>;
/**
 * Decrypts and downloads an AES256-CBC encrypted file given the keys.
 * Assumes the SHA256 of the plaintext is appended to the end of the ciphertext
 * */
declare const downloadEncryptedContent: (downloadUrl: any, { cipherKey, iv }: {
    cipherKey: any;
    iv: any;
}, { startByte, endByte, options }?: {}) => Promise<any>;
declare function extensionForMediaMessage(message: any): any;
declare const uploadWithNodeHttp: ({ url, filePath, headers, timeoutMs, agent }: {
    agent: any;
    filePath: any;
    headers: any;
    timeoutMs: any;
    url: any;
}, redirectCount?: number) => Promise<any>;
declare const getWAUploadToServer: ({ customUploadHosts, fetchAgent, logger, options }: {
    customUploadHosts: any;
    fetchAgent: any;
    logger: any;
    options: any;
}, refreshMediaConn: any) => (filePath: any, { mediaType, fileEncSha256B64, timeoutMs }: {
    fileEncSha256B64: any;
    mediaType: any;
    timeoutMs: any;
}) => Promise<any>;
/**
 * Generate a binary node that will request the phone to re-upload the media & return the newly uploaded URL
 */
declare const encryptMediaRetryRequest: (key: any, mediaKey: any, meId: any) => {
    tag: string;
    attrs: {
        id: any;
        to: string;
        type: string;
    };
    content: ({
        tag: string;
        attrs: {
            jid?: undefined;
            from_me?: undefined;
            participant?: undefined;
        };
        content: {
            tag: string;
            attrs: {};
            content: any;
        }[];
    } | {
        content?: undefined;
        tag: string;
        attrs: {
            jid: any;
            from_me: string;
            participant: any;
        };
    })[];
};
declare const decodeMediaRetryNode: (node: any) => {
    key: {
        id: any;
        remoteJid: any;
        fromMe: boolean;
        participant: any;
    };
};
declare const decryptMediaRetryData: ({ ciphertext, iv }: {
    ciphertext: any;
    iv: any;
}, mediaKey: any, msgId: any) => any;
declare const getStatusCodeForMediaRetry: (code: any) => number;
export { getMediaKeys };
export { getAudioDuration };
export { getAudioWaveform };
export { generateThumbnail };
export { extensionForMediaMessage };
export { hkdfInfoKey };
export { getRawMediaUploadData };
export { extractImageThumb };
export { encodeBase64EncodedStringForUpload };
export { generateProfilePicture };
export { mediaMessageSHA256B64 };
export { toReadable };
export { toBuffer };
export { getStream };
export { getHttpStream };
export { encryptedStream };
export { DEF_MEDIA_HOST };
export { getUrlFromDirectPath };
export { downloadContentFromMessage };
export { downloadEncryptedContent };
export { uploadWithNodeHttp };
export { getWAUploadToServer };
export { encryptMediaRetryRequest };
export { decodeMediaRetryNode };
export { decryptMediaRetryData };
export { getStatusCodeForMediaRetry };
