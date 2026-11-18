declare const Browsers: {
    ubuntu: (browser: any) => any[];
    macOS: (browser: any) => any[];
    baileys: (browser: any) => any[];
    windows: (browser: any) => any[];
    android: (browser: any) => any[];
    /** The appropriate browser based on your OS & release */
    appropriate: (browser: any) => any[];
};
declare const getPlatformId: (browser: any) => any;
export { Browsers };
export { getPlatformId };
