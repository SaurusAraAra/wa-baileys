

import * as index_js_1 from '../WAProto/index.js';
const requireObject = (value, name) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }
    return value;
};
const requireKey = (value, name = 'key') => {
    requireObject(value, name);
    if (!value.id) {
        throw new TypeError(`${name}.id is required`);
    }
    return value;
};
const enumValue = (enumObject, value, fallback) => {
    if (typeof value === 'number')
        return value;
    if (typeof value === 'string') {
        const key = value.trim().toUpperCase();
        if (key in enumObject)
            return enumObject[key];
    }
    return fallback;
};
const STATUS_NOTIFICATION_TYPES = Object.freeze({
    ...index_js_1.proto.Message.StatusNotificationMessage.StatusNotificationType,
    STATUS_GROUP_STATUS_REPLY: 4
});
const toSeconds = value => value instanceof Date ? Math.floor(value.getTime() / 1000) : value;
const toMilliseconds = value => value instanceof Date ? value.getTime() : value;
const makeInnerCommentMessage = content => {
    const data = requireObject(content, 'comment.content');
    if (data.raw && typeof data.raw === 'object')
        return data.raw;
    if (typeof data.text === 'string') {
        return {
            extendedTextMessage: index_js_1.proto.Message.ExtendedTextMessage.create({
                text: data.text,
                contextInfo: data.contextInfo
            })
        };
    }
    const keys = Object.keys(data);
    if (keys.some(key => key.endsWith('Message')))
        return data;
    throw new TypeError('comment.content supports text, raw, or protobuf message fields');
};
const makeQuestionMessage = input => {
    const data = requireObject(input, 'question');
    if (typeof data.text !== 'string' || !data.text.length) {
        throw new TypeError('question.text is required');
    }
    return {
        questionMessage: index_js_1.proto.Message.FutureProofMessage.create({
            message: {
                extendedTextMessage: index_js_1.proto.Message.ExtendedTextMessage.create({
                    text: data.text,
                    contextInfo: {
                        ...(data.contextInfo || {}),
                        isQuestion: true
                    }
                })
            }
        })
    };
};

const makeQuestionResponseMessage = input => {
    const data = requireObject(input, 'questionResponse');
    requireKey(data.key, 'questionResponse.key');
    return {
        questionResponseMessage: index_js_1.proto.Message.QuestionResponseMessage.create({
            key: data.key,
            text: data.text ?? ''
        })
    };
};

const makeQuestionReplyMessage = input => {
    const data = requireObject(input, 'questionReply');
    if (typeof data.text !== 'string' || !data.text.length) {
        throw new TypeError('questionReply.text is required');
    }
    if (data.serverQuestionId === undefined || data.serverQuestionId === null) {
        throw new TypeError('questionReply.serverQuestionId is required');
    }
    const quoted = {
        serverQuestionId: Number(data.serverQuestionId)
    };
    if (data.quotedQuestion)
        quoted.quotedQuestion = data.quotedQuestion;
    if (data.quotedResponse)
        quoted.quotedResponse = data.quotedResponse;
    return {
        questionReplyMessage: index_js_1.proto.Message.FutureProofMessage.create({
            message: {
                extendedTextMessage: index_js_1.proto.Message.ExtendedTextMessage.create({
                    text: data.text,
                    contextInfo: {
                        ...(data.contextInfo || {}),
                        questionReplyQuotedMessage: quoted
                    }
                })
            }
        })
    };
};

const makeStatusQuestionAnswerMessage = input => {
    const data = requireObject(input, 'statusQuestionAnswer');
    requireKey(data.key, 'statusQuestionAnswer.key');
    return {
        statusQuestionAnswerMessage: index_js_1.proto.Message.StatusQuestionAnswerMessage.create({
            key: data.key,
            text: data.text ?? ''
        })
    };
};

const makeStatusQuotedMessage = input => {
    const data = requireObject(input, 'statusQuoted');
    requireKey(data.originalStatusId, 'statusQuoted.originalStatusId');
    const type = enumValue(index_js_1.proto.Message.StatusQuotedMessage.StatusQuotedMessageType, data.type, index_js_1.proto.Message.StatusQuotedMessage.StatusQuotedMessageType.QUESTION_ANSWER);
    return {
        statusQuotedMessage: index_js_1.proto.Message.StatusQuotedMessage.create({
            type,
            text: data.text,
            thumbnail: data.thumbnail,
            originalStatusId: data.originalStatusId
        })
    };
};

const makeStatusStickerInteractionMessage = input => {
    const data = requireObject(input, 'statusStickerInteraction');
    requireKey(data.key, 'statusStickerInteraction.key');
    if (!data.stickerKey) {
        throw new TypeError('statusStickerInteraction.stickerKey is required');
    }
    const type = enumValue(index_js_1.proto.Message.StatusStickerInteractionMessage.StatusStickerType, data.type, index_js_1.proto.Message.StatusStickerInteractionMessage.StatusStickerType.REACTION);
    return {
        statusStickerInteractionMessage: index_js_1.proto.Message.StatusStickerInteractionMessage.create({
            key: data.key,
            stickerKey: data.stickerKey,
            type
        })
    };
};

const makeStatusNotificationMessage = input => {
    const data = requireObject(input, 'statusNotification');
    requireKey(data.responseMessageKey, 'statusNotification.responseMessageKey');
    requireKey(data.originalMessageKey, 'statusNotification.originalMessageKey');
    const type = enumValue(STATUS_NOTIFICATION_TYPES, data.type, STATUS_NOTIFICATION_TYPES.UNKNOWN);
    return {
        statusNotificationMessage: index_js_1.proto.Message.StatusNotificationMessage.create({
            responseMessageKey: data.responseMessageKey,
            originalMessageKey: data.originalMessageKey,
            type
        })
    };
};

const makeNewsletterAdminInviteMessage = input => {
    const data = requireObject(input, 'newsletterAdminInvite');
    if (!data.newsletterJid) {
        throw new TypeError('newsletterAdminInvite.newsletterJid is required');
    }
    return {
        newsletterAdminInviteMessage: index_js_1.proto.Message.NewsletterAdminInviteMessage.create({
            newsletterJid: data.newsletterJid,
            newsletterName: data.newsletterName,
            jpegThumbnail: data.jpegThumbnail,
            caption: data.caption,
            inviteExpiration: data.inviteExpiration,
            contextInfo: data.contextInfo
        })
    };
};

const makeNewsletterFollowerInviteMessage = input => {
    const data = requireObject(input, 'newsletterFollowerInvite');
    if (!data.newsletterJid) {
        throw new TypeError('newsletterFollowerInvite.newsletterJid is required');
    }
    return {
        newsletterFollowerInviteMessageV2: index_js_1.proto.Message.NewsletterFollowerInviteMessage.create({
            newsletterJid: data.newsletterJid,
            newsletterName: data.newsletterName,
            jpegThumbnail: data.jpegThumbnail,
            caption: data.caption,
            contextInfo: data.contextInfo
        })
    };
};

const makePollAddOptionMessage = input => {
    const data = requireObject(input, 'pollAddOption');
    requireKey(data.pollCreationMessageKey, 'pollAddOption.pollCreationMessageKey');
    const addOption = typeof data.option === 'string'
        ? { optionName: data.option }
        : data.addOption || data.option;
    if (!addOption?.optionName) {
        throw new TypeError('pollAddOption.option is required');
    }
    return {
        pollAddOptionMessage: index_js_1.proto.Message.PollAddOptionMessage.create({
            pollCreationMessageKey: data.pollCreationMessageKey,
            addOption,
            metadata: data.metadata
        })
    };
};

const makeCommentMessage = input => {
    const data = requireObject(input, 'comment');
    requireKey(data.targetMessageKey, 'comment.targetMessageKey');
    const message = data.message || (data.content ? makeInnerCommentMessage(data.content) : null);
    requireObject(message, 'comment.message');
    return {
        commentMessage: index_js_1.proto.Message.CommentMessage.create({
            message,
            targetMessageKey: data.targetMessageKey
        })
    };
};

const makeEventInviteMessage = input => {
    const data = requireObject(input, 'eventInvite');
    if (!data.eventId) {
        throw new TypeError('eventInvite.eventId is required');
    }
    return {
        eventInviteMessage: index_js_1.proto.Message.EventInviteMessage.create({
            contextInfo: data.contextInfo,
            eventId: data.eventId,
            eventTitle: data.eventTitle,
            jpegThumbnail: data.jpegThumbnail,
            startTime: toSeconds(data.startTime),
            caption: data.caption,
            isCanceled: data.isCanceled,
            endTime: toSeconds(data.endTime),
            callLink: data.callLink
        })
    };
};

const makeScheduledCallCreationMessage = input => {
    const data = requireObject(input, 'scheduledCall');
    if (!data.scheduledTimestampMs) {
        throw new TypeError('scheduledCall.scheduledTimestampMs is required');
    }
    const callType = enumValue(index_js_1.proto.Message.ScheduledCallCreationMessage.CallType, data.callType, index_js_1.proto.Message.ScheduledCallCreationMessage.CallType.UNKNOWN);
    return {
        scheduledCallCreationMessage: index_js_1.proto.Message.ScheduledCallCreationMessage.create({
            scheduledTimestampMs: toMilliseconds(data.scheduledTimestampMs),
            callType,
            title: data.title
        })
    };
};

const makeScheduledCallEditMessage = input => {
    const data = requireObject(input, 'scheduledCallEdit');
    requireKey(data.key, 'scheduledCallEdit.key');
    const editType = enumValue(index_js_1.proto.Message.ScheduledCallEditMessage.EditType, data.editType, index_js_1.proto.Message.ScheduledCallEditMessage.EditType.CANCEL);
    return {
        scheduledCallEditMessage: index_js_1.proto.Message.ScheduledCallEditMessage.create({
            key: data.key,
            editType
        })
    };
};

const makeGroupStatusReactionMessage = input => {
    const data = requireObject(input, 'groupStatusReaction');
    requireKey(data.key, 'groupStatusReaction.key');
    return {
        groupStatusMessageV2: index_js_1.proto.Message.FutureProofMessage.create({
            message: {
                reactionMessage: index_js_1.proto.Message.ReactionMessage.create({
                    key: data.key,
                    text: data.text ?? '',
                    groupingKey: data.groupingKey,
                    senderTimestampMs: data.senderTimestampMs || Date.now()
                })
            }
        })
    };
};

const makeNewsletterStatusAttribution = input => {
    const data = requireObject(input, 'newsletterStatus');
    if (!data.newsletterJid) {
        throw new TypeError('newsletterStatus.newsletterJid is required');
    }
    if (data.messageId === undefined || data.messageId === null) {
        throw new TypeError('newsletterStatus.messageId is required');
    }
    return index_js_1.proto.StatusAttribution.create({
        type: index_js_1.proto.StatusAttribution.Type.NEWSLETTER_STATUS,
        actionUrl: data.actionUrl,
        statusReshare: {
            source: index_js_1.proto.StatusAttribution.StatusReshare.Source.CHANNEL_RESHARE,
            metadata: {
                duration: data.duration,
                channelJid: data.newsletterJid,
                channelMessageId: Number(data.messageId),
                hasMultipleReshares: data.hasMultipleReshares ?? false
            }
        }
    });
};

const makeGroupStatusAttribution = input => {
    const data = requireObject(input, 'groupStatusAttribution');
    if (!data.authorJid) {
        throw new TypeError('groupStatusAttribution.authorJid is required');
    }
    return index_js_1.proto.StatusAttribution.create({
        type: index_js_1.proto.StatusAttribution.Type.GROUP_STATUS,
        actionUrl: data.actionUrl,
        groupStatus: {
            authorJid: data.authorJid
        }
    });
};

const STATUS_AUDIENCE_DEFAULT_LIST_NAME = 'Close friends';
const STATUS_AUDIENCE_DEFAULT_EMOJI = '⭐';
const makeStatusAudienceMetadata = input => {
    const data = typeof input === 'string' ? { listName: input } : requireObject(input, 'statusAudience');
    const audienceType = enumValue(index_js_1.proto.ContextInfo.StatusAudienceMetadata.AudienceType, data.audienceType, index_js_1.proto.ContextInfo.StatusAudienceMetadata.AudienceType.CLOSE_FRIENDS);
    const listName = data.listName === undefined ? STATUS_AUDIENCE_DEFAULT_LIST_NAME : String(data.listName);
    const listEmoji = data.listEmoji === undefined ? STATUS_AUDIENCE_DEFAULT_EMOJI : String(data.listEmoji);
    return index_js_1.proto.ContextInfo.StatusAudienceMetadata.create({
        audienceType,
        listName,
        listEmoji
    });
};

const makeMessageAssociation = input => {
    const data = requireObject(input, 'messageAssociation');
    const parentMessageKey = data.parentMessageKey ?? data.key;
    requireKey(parentMessageKey, 'messageAssociation.parentMessageKey');
    const associationType = enumValue(index_js_1.proto.MessageAssociation.AssociationType, data.associationType ?? data.type, index_js_1.proto.MessageAssociation.AssociationType.UNKNOWN);
    return index_js_1.proto.MessageAssociation.create({
        associationType,
        parentMessageKey,
        messageIndex: data.messageIndex
    });
};

const makeStatusAddYoursAssociation = input => {
    const data = input && typeof input === 'object' && !Array.isArray(input) && input.id
        ? { key: input }
        : requireObject(input, 'addYours');
    const parentMessageKey = data.key ?? data.parentMessageKey;
    requireKey(parentMessageKey, 'addYours.key');
    const associationType = enumValue(index_js_1.proto.MessageAssociation.AssociationType, data.type ?? data.associationType, index_js_1.proto.MessageAssociation.AssociationType.STATUS_ADD_YOURS);
    return index_js_1.proto.MessageAssociation.create({
        associationType,
        parentMessageKey,
        messageIndex: data.messageIndex
    });
};

const makeStatusMentionMessage = input => {
    const data = requireObject(input, 'statusMention');
    requireKey(data.key, 'statusMention.key');
    const field = data.group ? 'groupStatusMentionMessage' : 'statusMentionMessage';
    return {
        [field]: index_js_1.proto.Message.FutureProofMessage.create({
            message: {
                protocolMessage: index_js_1.proto.Message.ProtocolMessage.create({
                    key: data.key,
                    type: index_js_1.proto.Message.ProtocolMessage.Type.STATUS_MENTION_MESSAGE
                })
            }
        })
    };
};

const modernBuilders = [
    ['question', makeQuestionMessage],
    ['questionReply', makeQuestionReplyMessage],
    ['questionResponse', makeQuestionResponseMessage],
    ['statusQuestionAnswer', makeStatusQuestionAnswerMessage],
    ['statusQuoted', makeStatusQuotedMessage],
    ['statusStickerInteraction', makeStatusStickerInteractionMessage],
    ['statusNotification', makeStatusNotificationMessage],
    ['newsletterAdminInvite', makeNewsletterAdminInviteMessage],
    ['newsletterFollowerInvite', makeNewsletterFollowerInviteMessage],
    ['pollAddOption', makePollAddOptionMessage],
    ['comment', makeCommentMessage],
    ['eventInvite', makeEventInviteMessage],
    ['scheduledCall', makeScheduledCallCreationMessage],
    ['scheduledCallEdit', makeScheduledCallEditMessage],
    ['groupStatusReaction', makeGroupStatusReactionMessage],
    ['statusMention', makeStatusMentionMessage]
];
const prepareModernMessageContent = content => {
    if (!content || typeof content !== 'object' || Array.isArray(content))
        return content;
    let output = { ...content };
    const attributions = Array.isArray(output.contextInfo?.statusAttributions)
        ? [...output.contextInfo.statusAttributions]
        : [];
    if (output.newsletterStatus) {
        attributions.push(makeNewsletterStatusAttribution(output.newsletterStatus));
        delete output.newsletterStatus;
    }
    if (output.groupStatusAttribution) {
        attributions.push(makeGroupStatusAttribution(output.groupStatusAttribution));
        delete output.groupStatusAttribution;
    }
    if (Array.isArray(output.statusAttributions)) {
        attributions.push(...output.statusAttributions);
        delete output.statusAttributions;
    }
    const carried = [];
    const audience = output.statusAudience;
    if (audience !== undefined && audience !== null) {
        carried.push('statusAudience');
        output.contextInfo = {
            ...(output.contextInfo || {}),
            statusAudienceMetadata: makeStatusAudienceMetadata(audience)
        };
        delete output.statusAudience;
    }
    if (attributions.length) {
        output.contextInfo = {
            ...(output.contextInfo || {}),
            statusAttributions: attributions
        };
    }
    if (output.addYours !== undefined && output.addYours !== null) {
        carried.push('addYours');
        output.messageAssociation = makeStatusAddYoursAssociation(output.addYours);
        delete output.addYours;
    }
    else if (output.messageAssociation !== undefined && output.messageAssociation !== null) {
        carried.push('messageAssociation');
        output.messageAssociation = makeMessageAssociation(output.messageAssociation);
    }
    for (const [key, builder] of modernBuilders) {
        if (output[key] !== undefined && output[key] !== null) {
            if (carried.length) {
                throw new TypeError(`${carried.join(' and ')} cannot be combined with ${key}: ${key} builds its own message and keeps no room for them. `
                    + 'Build it with the low-level makers and generateWAMessageFromContent instead.');
            }
            return {
                raw: true,
                ...builder(output[key])
            };
        }
    }
    return output;
};


export { STATUS_NOTIFICATION_TYPES };
export { makeQuestionMessage };
export { makeQuestionResponseMessage };
export { makeQuestionReplyMessage };
export { makeStatusQuestionAnswerMessage };
export { makeStatusQuotedMessage };
export { makeStatusStickerInteractionMessage };
export { makeStatusNotificationMessage };
export { makeNewsletterAdminInviteMessage };
export { makeNewsletterFollowerInviteMessage };
export { makePollAddOptionMessage };
export { makeCommentMessage };
export { makeEventInviteMessage };
export { makeScheduledCallCreationMessage };
export { makeScheduledCallEditMessage };
export { makeGroupStatusReactionMessage };
export { makeNewsletterStatusAttribution };
export { makeGroupStatusAttribution };
export { STATUS_AUDIENCE_DEFAULT_LIST_NAME };
export { STATUS_AUDIENCE_DEFAULT_EMOJI };
export { makeStatusAudienceMetadata };
export { makeMessageAssociation };
export { makeStatusAddYoursAssociation };
export { makeStatusMentionMessage };
export { prepareModernMessageContent };
