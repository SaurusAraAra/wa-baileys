declare function generateSenderKey(): any;
declare function generateSenderKeyId(): any;
declare function generateSenderSigningKey(key: any): {
    public: any;
    private: any;
};
export { generateSenderKey };
export { generateSenderKeyId };
export { generateSenderSigningKey };
