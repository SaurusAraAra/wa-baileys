declare class USyncQuery {
    protocols: any[];
    users: any[];
    context: string;
    mode: string;
    constructor();
    withMode(mode: any): this;
    withContext(context: any): this;
    withUser(user: any): this;
    parseUSyncQueryResult(result: any): {
        list: any[];
        sideList: any[];
    };
    withDeviceProtocol(): this;
    withContactProtocol(): this;
    withStatusProtocol(): this;
    withDisappearingModeProtocol(): this;
    withBotProfileProtocol(): this;
    withLIDProtocol(): this;
    withUsernameProtocol(): this;
}
export { USyncQuery };
