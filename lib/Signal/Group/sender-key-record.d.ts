import * as sender_key_state_1 from './sender-key-state.js';
declare class SenderKeyRecord {
    MAX_STATES: number;
    senderKeyStates: sender_key_state_1.SenderKeyState[];
    constructor(serialized: any);
    isEmpty(): boolean;
    getSenderKeyState(keyId: any): sender_key_state_1.SenderKeyState;
    addSenderKeyState(id: any, iteration: any, chainKey: any, signatureKey: any): void;
    setSenderKeyState(id: any, iteration: any, chainKey: any, keyPair: any): void;
    serialize(): any[];
    static deserialize(data: any): SenderKeyRecord;
}
export { SenderKeyRecord };
