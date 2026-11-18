declare const makeLtHashGenerator: ({ indexValueMap, hash }: {
    hash: any;
    indexValueMap: any;
}) => {
    mix: ({ indexMac, valueMac, operation }: {
        indexMac: any;
        operation: any;
        valueMac: any;
    }) => void;
    finish: () => {
        hash: any;
        indexValueMap: any;
    };
};
declare const newLTHashState: () => {
    version: number;
    hash: any;
    indexValueMap: {};
};
declare const ensureLTHashStateVersion: (state: any) => any;
declare const MAX_SYNC_ATTEMPTS = 2;
/**
 * Check if an error is a missing app state sync key.
 * WA Web treats these as "Blocked" (waits for key arrival), not fatal.
 * In Baileys we retry with a snapshot which may use a different key.
 */
declare const isMissingKeyError: (error: any) => boolean;
/**
 * Determines if an app state sync error is unrecoverable.
 * TypeError indicates a WASM crash; otherwise we give up after MAX_SYNC_ATTEMPTS.
 * Missing keys are NOT checked here — they are handled separately as "Blocked".
 */
declare const isAppStateSyncIrrecoverable: (error: any, attempts: any) => boolean;
declare const encodeSyncdPatch: ({ type, index, syncAction, apiVersion, operation }: {
    apiVersion: any;
    index: any;
    operation: any;
    syncAction: any;
    type: any;
}, myAppStateKeyId: any, state: any, getAppStateSyncKey: any) => Promise<{
    patch: {
        patchMac: any;
        snapshotMac: any;
        keyId: {
            id: any;
        };
        mutations: {
            operation: any;
            record: {
                index: {
                    blob: any;
                };
                value: {
                    blob: any;
                };
                keyId: {
                    id: any;
                };
            };
        }[];
    };
    state: any;
}>;
declare const decodeSyncdMutations: (msgMutations: any, initialState: any, getAppStateSyncKey: any, onMutation: any, validateMacs: any) => Promise<{
    hash: any;
    indexValueMap: any;
}>;
declare const decodeSyncdPatch: (msg: any, name: any, initialState: any, getAppStateSyncKey: any, onMutation: any, validateMacs: any) => Promise<{
    hash: any;
    indexValueMap: any;
}>;
declare const extractSyncdPatches: (result: any, options: any) => Promise<{}>;
declare const downloadExternalBlob: (blob: any, options: any) => Promise<any>;
declare const downloadExternalPatch: (blob: any, options: any) => Promise<any>;
declare const decodeSyncdSnapshot: (name: any, snapshot: any, getAppStateSyncKey: any, minimumVersionNumber: any, validateMacs: boolean, logger: any) => Promise<{
    state: {
        version: number;
        hash: any;
        indexValueMap: {};
    };
    mutationMap: {};
}>;
declare const decodePatches: (name: any, syncds: any, initial: any, getAppStateSyncKey: any, options: any, minimumVersionNumber: any, logger: any, validateMacs?: boolean) => Promise<{
    state: any;
    mutationMap: {};
}>;
declare const chatModificationToAppPatch: (mod: any, jid: any) => any;
declare const processSyncAction: (syncAction: any, ev: any, me: any, initialSyncOpts: any, logger: any) => void;
export { makeLtHashGenerator };
export { newLTHashState };
export { ensureLTHashStateVersion };
export { MAX_SYNC_ATTEMPTS };
export { isMissingKeyError };
export { isAppStateSyncIrrecoverable };
export { encodeSyncdPatch };
export { decodeSyncdMutations };
export { decodeSyncdPatch };
export { extractSyncdPatches };
export { downloadExternalBlob };
export { downloadExternalPatch };
export { decodeSyncdSnapshot };
export { decodePatches };
export { chatModificationToAppPatch };
export { processSyncAction };
