declare const makeMutex: () => {
    mutex(code: any): any;
};
declare const makeKeyedMutex: () => {
    mutex(key: any, task: any): Promise<any>;
};
export { makeMutex };
export { makeKeyedMutex };
