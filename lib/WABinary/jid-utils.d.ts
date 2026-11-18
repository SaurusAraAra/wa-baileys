declare const S_WHATSAPP_NET = "@s.whatsapp.net";
declare const OFFICIAL_BIZ_JID = "16505361212@c.us";
declare const SERVER_JID = "server@c.us";
declare const PSA_WID = "0@c.us";
declare const STORIES_JID = "status@broadcast";
declare const META_AI_JID = "13135550002@c.us";
declare var WAJIDDomains: any;
declare const getServerFromDomainType: (initialServer: any, domainType: any) => any;
declare const jidEncode: (user: any, server: any, device: any, agent: any) => string;
declare const jidDecode: (jid: any) => {
    server: any;
    user: any;
    domainType: any;
    device: number;
};
/** is the jid a user */
declare const areJidsSameUser: (jid1: any, jid2: any) => boolean;
/** is the jid Meta AI */
declare const isJidMetaAI: (jid: any) => any;
/** is the jid a PN user */
declare const isPnUser: (jid: any) => any;
/** is the jid a LID */
declare const isLidUser: (jid: any) => any;
/** is the jid a broadcast */
declare const isJidBroadcast: (jid: any) => any;
/** is the jid a group */
declare const isJidGroup: (jid: any) => any;
/** is the jid the status broadcast */
declare const isJidStatusBroadcast: (jid: any) => boolean;
/** is the jid a newsletter */
declare const isJidNewsletter: (jid: any) => any;
/** is the jid a hosted PN */
declare const isHostedPnUser: (jid: any) => any;
/** is the jid a hosted LID */
declare const isHostedLidUser: (jid: any) => any;
declare const isJidBot: (jid: any) => any;
declare const jidNormalizedUser: (jid: any) => string;
declare const transferDevice: (fromJid: any, toJid: any) => string;
export { S_WHATSAPP_NET };
export { OFFICIAL_BIZ_JID };
export { SERVER_JID };
export { PSA_WID };
export { STORIES_JID };
export { META_AI_JID };
export { getServerFromDomainType };
export { jidEncode };
export { jidDecode };
export { areJidsSameUser };
export { isJidMetaAI };
export { isPnUser };
export { isLidUser };
export { isJidBroadcast };
export { isJidGroup };
export { isJidStatusBroadcast };
export { isJidNewsletter };
export { isHostedPnUser };
export { isHostedLidUser };
export { isJidBot };
export { jidNormalizedUser };
export { transferDevice };
export { WAJIDDomains };
