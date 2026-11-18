declare const shouldIncludeReportingToken: (message: any) => boolean;
declare const getMessageReportingToken: (msgProtobuf: any, message: any, key: any) => Promise<{
    tag: string;
    attrs: {};
    content: {
        tag: string;
        attrs: {
            v: string;
        };
        content: any;
    }[];
}>;
export { shouldIncludeReportingToken };
export { getMessageReportingToken };
