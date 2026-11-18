declare const makeInMemoryStore: (config: any) => {
    chats: any;
    contacts: {};
    messages: {};
    groupMetadata: {};
    state: {
        connection: string;
    };
    presences: {};
    labels: import("./object-repository.js").ObjectRepository;
    labelAssociations: any;
    bind: (ev: any) => void;
    loadMessages: (jid: any, count: any, cursor: any) => Promise<any>;
    getLabels: () => import("./object-repository.js").ObjectRepository;
    getChatLabels: (chatId: any) => any;
    getMessageLabels: (messageId: any) => any;
    loadMessage: (jid: any, id: any) => Promise<any>;
    mostRecentMessage: (jid: any) => Promise<any>;
    fetchImageUrl: (jid: any, sock: any) => Promise<any>;
    fetchGroupMetadata: (jid: any, sock: any) => Promise<any>;
    fetchMessageReceipts: ({ remoteJid, id }: {
        id: any;
        remoteJid: any;
    }) => Promise<any>;
    toJSON: () => {
        chats: any;
        contacts: {};
        messages: {};
        labels: import("./object-repository.js").ObjectRepository;
        labelAssociations: any;
    };
    fromJSON: (json: any) => void;
    writeToFile: (path: any) => void;
    readFromFile: (path: any) => void;
};
export { makeInMemoryStore };
