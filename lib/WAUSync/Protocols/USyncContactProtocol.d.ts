declare class USyncContactProtocol {
    name: string;
    constructor();
    getQueryElement(): {
        tag: string;
        attrs: {};
    };
    getUserElement(user: any): {
        tag: string;
        attrs: {
            type?: undefined;
        };
        content: any;
    } | {
        content?: undefined;
        tag: string;
        attrs: {
            username: any;
            pin?: any;
            lid?: any;
            type?: undefined;
        };
    } | {
        content?: undefined;
        tag: string;
        attrs: {
            type: any;
        };
    } | {
        content?: undefined;
        tag: string;
        attrs: {
            type?: undefined;
        };
    };
    parser(node: any): boolean;
}
export { USyncContactProtocol };
