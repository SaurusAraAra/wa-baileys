import * as modern_messages_1 from './modern-messages.js';
declare const NEWSLETTER_STATUS_MEDIA_TYPES: Set<string>;
declare const NEWSLETTER_STATUS_WEB_MEDIA_TYPES: Set<string>;
declare const NEWSLETTER_STATUS_CONTENT_TYPES: Set<string>;
declare const getNewsletterStatusMediaType: (message: any) => "audio" | "gif" | "image" | "video";
declare const NEWSLETTER_SERVER_ID_MIN = 99;
declare const NEWSLETTER_SERVER_ID_MAX = 2147476647;
declare const toNewsletterServerId: (value: any, label: any) => string;
declare const withNewsletterStatusAttribution: (content: any) => any;
declare const parseNewsletterStatusAck: (node: any, { jid, messageId }?: {}) => {
    class: any;
    from: any;
    id: any;
    t: number;
    serverId: number;
    edit: any;
    error: string;
    applicationError: number;
    backoff: number;
    node: any;
};
/**
 * The ack carries from, class, id and t, and nothing else. The server id lands
 * separately, in the <status> stanza the server sends back to the publisher --
 * WASmaxInStatusDeliverFromNewsletterMixin reads from, server_id, t and
 * is_sender off exactly that tag. Reacting to or revoking your own status needs
 * that id, so wait a moment for the echo rather than returning undefined.
 */
declare const waitForNewsletterStatusServerId: (sock: any, { jid, messageId, timeoutMs }: {
    jid: any;
    messageId: any;
    timeoutMs?: number;
}) => Promise<any>;
declare const buildNewsletterAdminProfileStatusMessage: (message: any) => any;
declare const buildNewsletterStatusNode: ({ jid, message, payload, messageId, mediaType, mediaId, mediaHandle, parentServerId, responseServerId, interactionType, aiContent }: {
    aiContent: any;
    interactionType: any;
    jid: any;
    mediaHandle: any;
    mediaId: any;
    mediaType: any;
    message: any;
    messageId: any;
    parentServerId: any;
    payload: any;
    responseServerId: any;
}) => {
    tag: string;
    attrs: {
        to: any;
        id: any;
        type: string;
    };
    content: {
        tag: string;
        attrs: {
            mediatype: any;
        } | {
            mediatype?: undefined;
        };
        content: any;
    }[];
};
declare const buildNewsletterStatusReactionNode: ({ jid, messageId, parentServerId, reaction }: {
    jid: any;
    messageId: any;
    parentServerId: any;
    reaction: any;
}) => {
    tag: string;
    attrs: {
        to: any;
        id: any;
        server_id: string;
        type: string;
    };
    content: {
        tag: string;
        attrs: {
            code?: undefined;
        } | {
            code: any;
        };
        content: any;
    }[];
};
declare const buildNewsletterStatusRevokeNode: ({ jid, statusId }: {
    jid: any;
    statusId: any;
}) => {
    tag: string;
    attrs: {
        to: any;
        id: any;
        type: string;
        edit: string;
    };
    content: {
        tag: string;
        attrs: {};
        content: any;
    }[];
};
declare const makeNewsletterStatusSender: (sock: any, config: any) => (jid: any, content: any, options?: {}) => Promise<any>;
declare const makeNewsletterStatusReactionSender: (sock: any) => (jid: any, parentServerId: any, reaction: any, options?: {}) => Promise<{
    key: {
        remoteJid: any;
        fromMe: boolean;
        id: any;
    };
    status: any;
    newsletterStatusServerId: number;
    newsletterStatusAck: {
        class: any;
        from: any;
        id: any;
        t: number;
        serverId: number;
        edit: any;
        error: string;
        applicationError: number;
        backoff: number;
        node: any;
    };
    newsletterStatusResponse: any;
}>;
declare const makeNewsletterStatusRevokeSender: (sock: any) => (jid: any, statusId: any, options?: {}) => Promise<{
    key: {
        remoteJid: any;
        fromMe: boolean;
        id: any;
    };
    status: any;
    newsletterStatusAck: {
        class: any;
        from: any;
        id: any;
        t: number;
        serverId: number;
        edit: any;
        error: string;
        applicationError: number;
        backoff: number;
        node: any;
    };
    newsletterStatusResponse: any;
}>;
declare const parseNewsletterStatusUpdatesResponse: (node: any) => {
    jid: any;
    t: number;
    statuses: any;
};
declare const makeNewsletterStatusUpdatesFetcher: (sock: any) => (jid: any, options?: {}) => Promise<{
    jid: any;
    t: number;
    statuses: any;
}>;
declare const parseNewsletterStatusesResponse: (node: any) => {
    jid: any;
    t: number;
    statuses: any;
};
declare const makeNewsletterStatusFetcher: (sock: any) => (jid: any, options?: {}) => Promise<{
    jid: any;
    t: number;
    statuses: any;
}>;
declare const sendNewsletterStatus: (sock: any, inputOrJid: any, content: any, options?: {}) => Promise<any>;
declare const sendNewsletterStatusReaction: (sock: any, jid: any, parentServerId: any, reaction: any, options: any) => Promise<{
    key: {
        remoteJid: any;
        fromMe: boolean;
        id: any;
    };
    status: any;
    newsletterStatusServerId: number;
    newsletterStatusAck: {
        class: any;
        from: any;
        id: any;
        t: number;
        serverId: number;
        edit: any;
        error: string;
        applicationError: number;
        backoff: number;
        node: any;
    };
    newsletterStatusResponse: any;
}>;
declare const revokeNewsletterStatus: (sock: any, jid: any, serverId: any, options: any) => Promise<{
    key: {
        remoteJid: any;
        fromMe: boolean;
        id: any;
    };
    status: any;
    newsletterStatusAck: {
        class: any;
        from: any;
        id: any;
        t: number;
        serverId: number;
        edit: any;
        error: string;
        applicationError: number;
        backoff: number;
        node: any;
    };
    newsletterStatusResponse: any;
}>;
declare const getNewsletterStatuses: (sock: any, jid: any, options: any) => Promise<{
    jid: any;
    t: number;
    statuses: any;
}>;
declare const getNewsletterStatusUpdates: (sock: any, jid: any, options: any) => Promise<{
    jid: any;
    t: number;
    statuses: any;
}>;
declare const prepareNewsletterStatusContent: typeof modern_messages_1.prepareModernMessageContent;
export { NEWSLETTER_STATUS_MEDIA_TYPES };
export { NEWSLETTER_STATUS_WEB_MEDIA_TYPES };
export { NEWSLETTER_STATUS_CONTENT_TYPES };
export { getNewsletterStatusMediaType };
export { NEWSLETTER_SERVER_ID_MIN };
export { NEWSLETTER_SERVER_ID_MAX };
export { toNewsletterServerId };
export { withNewsletterStatusAttribution };
export { parseNewsletterStatusAck };
export { waitForNewsletterStatusServerId };
export { buildNewsletterAdminProfileStatusMessage };
export { buildNewsletterStatusNode };
export { buildNewsletterStatusReactionNode };
export { buildNewsletterStatusRevokeNode };
export { makeNewsletterStatusSender };
export { makeNewsletterStatusReactionSender };
export { makeNewsletterStatusRevokeSender };
export { parseNewsletterStatusUpdatesResponse };
export { makeNewsletterStatusUpdatesFetcher };
export { parseNewsletterStatusesResponse };
export { makeNewsletterStatusFetcher };
export { sendNewsletterStatus };
export { sendNewsletterStatusReaction };
export { revokeNewsletterStatus };
export { getNewsletterStatuses };
export { getNewsletterStatusUpdates };
export { prepareNewsletterStatusContent };
export { makeNewsletterStatusAttribution } from './modern-messages.js';
