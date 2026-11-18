declare class USyncDeviceProtocol {
    name: string;
    constructor();
    getQueryElement(): {
        tag: string;
        attrs: {
            version: string;
        };
    };
    getUserElement(): any;
    parser(node: any): {
        deviceList: any[];
        keyIndex: any;
    };
}
export { USyncDeviceProtocol };
