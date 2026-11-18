declare const downloadHistory: (msg: any, options: any) => Promise<any>;
declare const processHistoryMessage: (item: any, logger: any) => {
    chats: any[];
    contacts: any[];
    messages: any[];
    lidPnMappings: any[];
    pastParticipants: any;
    syncType: any;
    progress: any;
};
declare const downloadAndProcessHistorySyncNotification: (msg: any, options: any, logger: any) => Promise<{
    chats: any[];
    contacts: any[];
    messages: any[];
    lidPnMappings: any[];
    pastParticipants: any;
    syncType: any;
    progress: any;
}>;
declare const getHistoryMsg: (message: any) => any;
export { downloadHistory };
export { processHistoryMessage };
export { downloadAndProcessHistorySyncNotification };
export { getHistoryMsg };
