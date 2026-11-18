

import * as Defaults_1 from '../Defaults/index.js';
import * as communities_1 from './communities.js';
import * as newsletter_status_1 from '../Utils/newsletter-status.js';
import * as modern_messages_1 from '../Utils/modern-messages.js';
import * as spr_1 from '../Utils/spr.js';
const makeWASocket = (config) => {
    const newConfig = {
        ...Defaults_1.DEFAULT_CONNECTION_CONFIG,
        ...config
    };
    const sock = (0, communities_1.makeCommunitiesSocket)(newConfig);
    const sendMessage = sock.sendMessage.bind(sock);
    sock.sendMessage = (jid, content, options = {}) => sendMessage(jid, (0, modern_messages_1.prepareModernMessageContent)(content), options);
    sock.sendNewsletterStatus = (0, newsletter_status_1.makeNewsletterStatusSender)(sock, newConfig);
    sock.sendNewsletterStatusReaction = (0, newsletter_status_1.makeNewsletterStatusReactionSender)(sock);
    sock.revokeNewsletterStatus = (0, newsletter_status_1.makeNewsletterStatusRevokeSender)(sock);
    sock.getNewsletterStatuses = (0, newsletter_status_1.makeNewsletterStatusFetcher)(sock);
    sock.getNewsletterStatusUpdates = (0, newsletter_status_1.makeNewsletterStatusUpdatesFetcher)(sock);
    // SPR (Selective & Private Relay)
    sock.sPR = (jid, message, options) => (0, spr_1.sPR)(sock, jid, message, options);
    sock.relayMessageSelective = sock.sPR;
    sock.sPRPrivate = (groupJid, targetJid, options) => (0, spr_1.sPRPrivate)(sock, groupJid, targetJid, options);
    sock.sPRBroadcast = (groupJid, options) => (0, spr_1.sPRBroadcast)(sock, groupJid, options);
    sock.getSPRTargets = (groupJid, options) => (0, spr_1.getSPRTargets)(sock, groupJid, options);
    // Alias Private Relay bawaan Sauruspro
    sock.selectPrivateRelay = sock.sendPrivateRelay;
    // Helper newsletter.* (sendStatus, reactToStatus, revokeStatus, fetchStatuses, fetchStatusUpdates)
    sock.newsletter = {
        ...(sock.newsletter || {}),
        sendStatus: (inputOrJid, content, options = {}) => {
            if (inputOrJid && typeof inputOrJid === 'object' && !content) {
                const { jid, content: ct, ...opts } = inputOrJid;
                return sock.sendNewsletterStatus(jid, ct, opts);
            }
            return sock.sendNewsletterStatus(inputOrJid, content, options);
        },
        reactToStatus: (inputOrJid, parentServerId, reaction, options = {}) => {
            if (inputOrJid && typeof inputOrJid === 'object' && !parentServerId) {
                const { jid, parentServerId: p, reaction: r, ...opts } = inputOrJid;
                return sock.sendNewsletterStatusReaction(jid, p, r, opts);
            }
            return sock.sendNewsletterStatusReaction(inputOrJid, parentServerId, reaction, options);
        },
        revokeStatus: (inputOrJid, statusId, options = {}) => {
            if (inputOrJid && typeof inputOrJid === 'object' && !statusId) {
                const { jid, statusId: sid, ...opts } = inputOrJid;
                return sock.revokeNewsletterStatus(jid, sid, opts);
            }
            return sock.revokeNewsletterStatus(inputOrJid, statusId, options);
        },
        fetchStatuses: (inputOrJid, options = {}) => {
            if (inputOrJid && typeof inputOrJid === 'object') {
                const { jid, ...opts } = inputOrJid;
                return sock.getNewsletterStatuses(jid, opts);
            }
            return sock.getNewsletterStatuses(inputOrJid, options);
        },
        fetchStatusUpdates: (inputOrJid, options = {}) => {
            if (inputOrJid && typeof inputOrJid === 'object') {
                const { jid, ...opts } = inputOrJid;
                return sock.getNewsletterStatusUpdates(jid, opts);
            }
            return sock.getNewsletterStatusUpdates(inputOrJid, options);
        }
    };
    return sock;
};


export { makeWASocket as default };
