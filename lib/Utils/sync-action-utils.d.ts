/**
 * Process contactAction and return events to emit.
 * Pure function - no side effects.
 */
declare const processContactAction: (action: any, id: any, logger: any) => any[];
declare const emitSyncActionResults: (ev: any, results: any) => void;
export { processContactAction };
export { emitSyncActionResults };
