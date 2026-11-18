import * as events_1 from 'events';
declare class AbstractSocketClient extends events_1.EventEmitter {
    url: any;
    config: any;
    constructor(url: any, config: any);
}
export { AbstractSocketClient };
