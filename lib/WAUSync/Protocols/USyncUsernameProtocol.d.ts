declare class USyncUsernameProtocol {
    name: string;
    constructor();
    getQueryElement(): {
        tag: string;
        attrs: {};
    };
    getUserElement(user: any): any;
    parser(node: any): any;
}
export { USyncUsernameProtocol };
