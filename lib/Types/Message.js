

import * as index_js_1 from '../WAProto/index.js';

const WAMessageStubType = index_js_1.proto.WebMessageInfo.StubType;
const WAMessageStatus = index_js_1.proto.WebMessageInfo.Status;
var WAMessageAddressingMode;
(function (WAMessageAddressingMode) {
    WAMessageAddressingMode["PN"] = "pn";
    WAMessageAddressingMode["LID"] = "lid";
})(WAMessageAddressingMode || (WAMessageAddressingMode = {}));

export { WAMessageStubType };
export { WAMessageStatus };
export { WAMessageAddressingMode };
export { proto as WAProto } from '../WAProto/index.js';
