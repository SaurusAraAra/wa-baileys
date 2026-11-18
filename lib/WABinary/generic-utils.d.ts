declare const getBinaryNodeChildren: (node: any, childTag: any) => any;
declare const getBinaryNodeChild: (node: any, childTag: any) => any;
declare const getAllBinaryNodeChildren: ({ content }: {
    content: any;
}) => any[];
declare const getBinaryNodeChildBuffer: (node: any, childTag: any) => any;
declare const getBinaryNodeChildString: (node: any, childTag: any) => any;
declare const getBinaryNodeChildUInt: (node: any, childTag: any, length: any) => number;
declare const assertNodeErrorFree: (node: any) => void;
declare const reduceBinaryNodeToDictionary: (node: any, tag: any) => any;
declare const getBinaryNodeMessages: ({ content }: {
    content: any;
}) => any[];
declare function binaryNodeToString(node: any, i?: number): any;
export { binaryNodeToString };
export { getBinaryNodeChildren };
export { getBinaryNodeChild };
export { getAllBinaryNodeChildren };
export { getBinaryNodeChildBuffer };
export { getBinaryNodeChildString };
export { getBinaryNodeChildUInt };
export { assertNodeErrorFree };
export { reduceBinaryNodeToDictionary };
export { getBinaryNodeMessages };
