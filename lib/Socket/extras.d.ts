/** Method tambahan yang dipasang Sauruspro pada socket. */
export interface SocketExtras {
    /** Selective & Private Relay: kirim pesan grup hanya ke/kecuali device tertentu. */
    sPR(jid: string, message: any, options?: any): Promise<any>;
    relayMessageSelective(jid: string, message: any, options?: any): Promise<any>;
    sPRPrivate(groupJid: string, targetJid: string, options?: any): Promise<any>;
    sPRBroadcast(groupJid: string, options?: any): Promise<any>;
    getSPRTargets(groupJid: string, options?: any): Promise<any>;
    /** Alias dari sendPrivateRelay. */
    selectPrivateRelay(jid: string, message: any, options?: any): Promise<any>;
    sendNewsletterStatus(jid: string, content: any, options?: any): Promise<any>;
    sendNewsletterStatusReaction(jid: string, parentServerId: string, reaction: string, options?: any): Promise<any>;
    revokeNewsletterStatus(jid: string, statusId: string, options?: any): Promise<any>;
    getNewsletterStatuses(jid: string, options?: any): Promise<any>;
    getNewsletterStatusUpdates(jid: string, options?: any): Promise<any>;
    newsletter: {
        sendStatus(jidOrInput: any, content?: any, options?: any): Promise<any>;
        reactToStatus(jidOrInput: any, parentServerId?: string, reaction?: string, options?: any): Promise<any>;
        revokeStatus(jidOrInput: any, statusId?: string, options?: any): Promise<any>;
        fetchStatuses(jidOrInput: any, options?: any): Promise<any>;
        fetchStatusUpdates(jidOrInput: any, options?: any): Promise<any>;
        [key: string]: any;
    };
}
