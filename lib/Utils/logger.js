

import __d_pino_1 from 'pino';
const pino_1 = __d_pino_1 && __d_pino_1.__esModule ? __d_pino_1 : { default: __d_pino_1 };
const __default = (0, pino_1.default)({ timestamp: () => `,"time":"${new Date().toJSON()}"` });

export { __default as default };
