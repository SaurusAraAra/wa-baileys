declare const StatusLinkType: Readonly<{
    RASTERIZED_LINK_PREVIEW: 1;
    RASTERIZED_LINK_TRUNCATED: 2;
    RASTERIZED_LINK_FULL_URL: 3;
}>;
declare const STICKER_DEFAULT_AREA: Readonly<{
    x: 0.25;
    y: 0.4;
    width: 0.5;
    height: 0.2;
}>;
declare const stickerArea: ({ x, y, width, height }?: Readonly<{
    x: 0.25;
    y: 0.4;
    width: 0.5;
    height: 0.2;
}>) => {
    x: number;
    y: number;
}[];
declare const locationSticker: ({ latitude, longitude, name, area, skipConfirmation }?: {}) => any;
declare const channelSticker: ({ jid, name, serverMessageId, accessibilityText, area }?: {
    serverMessageId?: number;
}) => any;
declare const linkSticker: ({ url, title, area, linkType }?: {
    linkType?: 1;
}) => any;
declare const musicSticker: ({ songId, title, author, mediaId, artworkDirectPath, artworkSha256, artworkEncSha256, artworkMediaKey, artistAttribution, countryBlocklist, isExplicit, startTimeMs, derivedStartTimeMs, durationMs, area }?: {
    startTimeMs?: number;
}) => any;
declare const messageSticker: ({ stanzaId, message, area }?: {}) => any;
declare const normalizeStickers: (stickers: any) => any[];
declare const readStickers: (message: any) => {
    kind: string;
    area: {
        x: any;
        y: any;
        width: number;
        height: number;
    };
    location: any;
    channel: any;
    link: {
        url: any;
        title: any;
        linkType: any;
    };
    music: {
        songId: any;
        title: any;
        author: any;
    };
    message: any;
    annotation: any;
}[];
declare const MusicMessageStyle: Readonly<{
    UNKNOWN: 0;
    VINYL: 1;
}>;
declare const MUSIC_ALLOWED_HOSTS: readonly string[];
declare const isMusicHostAllowed: (value: any) => boolean;
declare const buildMusicMessage: ({ songUri, artworkUri, style, contextInfo, ...music }?: {
    style?: 1;
}) => any;
declare const readMusicMessage: (msg: any) => {
    songId: any;
    mediaId: any;
    title: any;
    author: any;
    artistAttribution: any;
    isExplicit: any;
    startTimeMs: any;
    durationMs: any;
    songUri: any;
    artworkUri: any;
    style: any;
    embeddedMusic: any;
};
export { StatusLinkType };
export { STICKER_DEFAULT_AREA };
export { stickerArea };
export { locationSticker };
export { channelSticker };
export { linkSticker };
export { musicSticker };
export { messageSticker };
export { normalizeStickers };
export { readStickers };
export { MusicMessageStyle };
export { MUSIC_ALLOWED_HOSTS };
export { isMusicHostAllowed };
export { buildMusicMessage };
export { readMusicMessage };
