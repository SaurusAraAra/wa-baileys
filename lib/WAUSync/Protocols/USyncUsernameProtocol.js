

import * as WABinary_1 from '../../WABinary/index.js';
class USyncUsernameProtocol {
    constructor() {
        this.name = 'username';
    }
    getQueryElement() {
        return {
            tag: 'username',
            attrs: {}
        };
    }
    getUserElement(user) {
        void user;
        return null;
    }
    parser(node) {
        if (node.tag === 'username') {
            (0, WABinary_1.assertNodeErrorFree)(node);
            return typeof node.content === 'string' ? node.content : null;
        }
        return null;
    }
}


export { USyncUsernameProtocol };
