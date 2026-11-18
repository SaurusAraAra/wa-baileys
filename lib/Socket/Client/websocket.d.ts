import * as types_1 from './types.js';
declare class WebSocketClient extends types_1.AbstractSocketClient {
    socket: any;
    constructor();
    get isOpen(): boolean;
    get isClosed(): boolean;
    get isClosing(): boolean;
    get isConnecting(): boolean;
    connect(): void;
    close(): Promise<void>;
    send(str: any, cb: any): boolean;
}
export { WebSocketClient };
