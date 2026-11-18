declare var CompanionWebClientType: any;
declare const getCompanionWebClientType: ([os, browserName]: [any, any]) => any;
declare const getCompanionPlatformId: (browser: any) => any;
declare const buildPairingQRData: (ref: any, noiseKeyB64: any, identityKeyB64: any, advB64: any, browser: any) => string;
export { getCompanionWebClientType };
export { getCompanionPlatformId };
export { buildPairingQRData };
export { CompanionWebClientType };
