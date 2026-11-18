declare const STATUS_NOTIFICATION_TYPES: any;
declare const makeQuestionMessage: (input: any) => {
    questionMessage: any;
};
declare const makeQuestionResponseMessage: (input: any) => {
    questionResponseMessage: any;
};
declare const makeQuestionReplyMessage: (input: any) => {
    questionReplyMessage: any;
};
declare const makeStatusQuestionAnswerMessage: (input: any) => {
    statusQuestionAnswerMessage: any;
};
declare const makeStatusQuotedMessage: (input: any) => {
    statusQuotedMessage: any;
};
declare const makeStatusStickerInteractionMessage: (input: any) => {
    statusStickerInteractionMessage: any;
};
declare const makeStatusNotificationMessage: (input: any) => {
    statusNotificationMessage: any;
};
declare const makeNewsletterAdminInviteMessage: (input: any) => {
    newsletterAdminInviteMessage: any;
};
declare const makeNewsletterFollowerInviteMessage: (input: any) => {
    newsletterFollowerInviteMessageV2: any;
};
declare const makePollAddOptionMessage: (input: any) => {
    pollAddOptionMessage: any;
};
declare const makeCommentMessage: (input: any) => {
    commentMessage: any;
};
declare const makeEventInviteMessage: (input: any) => {
    eventInviteMessage: any;
};
declare const makeScheduledCallCreationMessage: (input: any) => {
    scheduledCallCreationMessage: any;
};
declare const makeScheduledCallEditMessage: (input: any) => {
    scheduledCallEditMessage: any;
};
declare const makeGroupStatusReactionMessage: (input: any) => {
    groupStatusMessageV2: any;
};
declare const makeNewsletterStatusAttribution: (input: any) => any;
declare const makeGroupStatusAttribution: (input: any) => any;
declare const STATUS_AUDIENCE_DEFAULT_LIST_NAME = "Close friends";
declare const STATUS_AUDIENCE_DEFAULT_EMOJI = "\u2B50";
declare const makeStatusAudienceMetadata: (input: any) => any;
declare const makeMessageAssociation: (input: any) => any;
declare const makeStatusAddYoursAssociation: (input: any) => any;
declare const makeStatusMentionMessage: (input: any) => {
    [x: string]: any;
};
declare const prepareModernMessageContent: (content: any) => any;
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
