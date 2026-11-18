declare const decompressingIfRequired: (buffer: any) => Promise<any>;
declare const decodeDecompressedBinaryNode: (buffer: any, opts: any, indexRef?: {
    index: number;
}) => {
    tag: any;
    attrs: {};
    content: any;
};
declare const decodeBinaryNode: (buff: any) => Promise<{
    tag: any;
    attrs: {};
    content: any;
}>;
export { decompressingIfRequired };
export { decodeDecompressedBinaryNode };
export { decodeBinaryNode };
