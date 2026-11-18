/** Sentinel key under `tctoken` store holding a JSON array of tracked storage JIDs for cross-session pruning. */
declare const TC_TOKEN_INDEX_KEY = "__index";
/** Read the persisted tctoken JID index and return its entries (never contains the sentinel key itself). */
declare function readTcTokenIndex(keys: any): Promise<any[]>;
/** Build a SignalDataSet fragment that writes the merged index (persisted ∪ added) under the sentinel key. */
declare function buildMergedTcTokenIndexWrite(keys: any, addedJids: any): Promise<{
    __index: {
        token: any;
    };
}>;
declare function isTcTokenExpired(timestamp: any): boolean;
declare function shouldSendNewTcToken(senderTimestamp: any): boolean;
/** Resolve JID to LID for tctoken storage (WA Web stores under LID) */
declare function resolveTcTokenJid(jid: any, getLIDForPN: any): Promise<any>;
/** Resolve target JID for issuing privacy token based on AB prop 14303 */
declare function resolveIssuanceJid(jid: any, issueToLid: any, getLIDForPN: any, getPNForLID: any): Promise<any>;
declare function buildTcTokenFromJid({ authState, jid, baseContent, getLIDForPN }: {
    authState: any;
    baseContent?: any[];
    getLIDForPN: any;
    jid: any;
}): Promise<any[]>;
declare function storeTcTokensFromIqResult({ result, fallbackJid, keys, getLIDForPN, onNewJidStored }: {
    fallbackJid: any;
    getLIDForPN: any;
    keys: any;
    onNewJidStored: any;
    result: any;
}): Promise<void>;
export { readTcTokenIndex };
export { buildMergedTcTokenIndexWrite };
export { isTcTokenExpired };
export { shouldSendNewTcToken };
export { resolveTcTokenJid };
export { resolveIssuanceJid };
export { buildTcTokenFromJid };
export { storeTcTokensFromIqResult };
export { TC_TOKEN_INDEX_KEY };
