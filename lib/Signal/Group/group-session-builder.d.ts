import * as sender_key_distribution_message_1 from './sender-key-distribution-message.js';
declare class GroupSessionBuilder {
    senderKeyStore: any;
    constructor(senderKeyStore: any);
    process(senderKeyName: any, senderKeyDistributionMessage: any): Promise<void>;
    create(senderKeyName: any): Promise<sender_key_distribution_message_1.SenderKeyDistributionMessage>;
}
export { GroupSessionBuilder };
