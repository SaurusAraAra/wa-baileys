declare function handleIdentityChange(node: any, ctx: any): Promise<{
    error?: undefined;
    action: string;
    device?: undefined;
} | {
    error?: undefined;
    action: string;
    device: number;
} | {
    device?: undefined;
    action: string;
    error: any;
}>;
export { handleIdentityChange };
