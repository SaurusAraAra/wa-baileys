declare class USyncStatusProtocol {
    name: string;
    constructor();
    getQueryElement(): {
        tag: string;
        attrs: {};
    };
    getUserElement(): any;
    parser(node: any): {
        status: any;
        setAt: Date;
    };
}
export { USyncStatusProtocol };
