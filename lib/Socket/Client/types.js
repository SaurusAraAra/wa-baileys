

import * as events_1 from 'events';
class AbstractSocketClient extends events_1.EventEmitter {
    constructor(url, config) {
        super();
        this.url = url;
        this.config = config;
        this.setMaxListeners(0);
    }
}


export { AbstractSocketClient };
