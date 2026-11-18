

import __d_ws_1 from 'ws';
const ws_1 = __d_ws_1 && __d_ws_1.__esModule ? __d_ws_1 : { default: __d_ws_1 };
import * as Defaults_1 from '../../Defaults/index.js';
import * as types_1 from './types.js';
class WebSocketClient extends types_1.AbstractSocketClient {
    constructor() {
        super(...arguments);
        this.socket = null;
    }
    get isOpen() {
        return this.socket?.readyState === ws_1.default.OPEN;
    }
    get isClosed() {
        return this.socket === null || this.socket?.readyState === ws_1.default.CLOSED;
    }
    get isClosing() {
        return this.socket === null || this.socket?.readyState === ws_1.default.CLOSING;
    }
    get isConnecting() {
        return this.socket?.readyState === ws_1.default.CONNECTING;
    }
    connect() {
        if (this.socket) {
            return;
        }
        this.socket = new ws_1.default(this.url, {
            origin: Defaults_1.DEFAULT_ORIGIN,
            headers: this.config.options?.headers,
            handshakeTimeout: this.config.connectTimeoutMs,
            timeout: this.config.connectTimeoutMs,
            agent: this.config.agent
        });
        this.socket.setMaxListeners(0);
        const events = ['close', 'error', 'upgrade', 'message', 'open', 'ping', 'pong', 'unexpected-response'];
        for (const event of events) {
            this.socket?.on(event, (...args) => this.emit(event, ...args));
        }
    }
    async close() {
        if (!this.socket) {
            return;
        }
        const closePromise = new Promise(resolve => {
            this.socket?.once('close', resolve);
        });
        this.socket.close();
        await closePromise;
        this.socket = null;
    }
    send(str, cb) {
        this.socket?.send(str, cb);
        return Boolean(this.socket);
    }
}


export { WebSocketClient };
