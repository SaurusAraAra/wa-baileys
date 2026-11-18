declare class USyncDisappearingModeProtocol {
    name: string;
    constructor();
    getQueryElement(): {
        tag: string;
        attrs: {};
    };
    getUserElement(): any;
    parser(node: any): {
        duration: number;
        setAt: Date;
    };
}
export { USyncDisappearingModeProtocol };
