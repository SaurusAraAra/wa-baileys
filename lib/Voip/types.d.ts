declare const CallState: Readonly<{
    Idle: 0;
    Calling: 1;
    PreacceptReceived: 2;
    ReceivedCall: 3;
    AcceptSent: 4;
    AcceptReceived: 5;
    Active: 6;
    ActiveElsewhere: 7;
    Ending: 13;
}>;
declare const __default: Readonly<{
    Idle: 0;
    Calling: 1;
    PreacceptReceived: 2;
    ReceivedCall: 3;
    AcceptSent: 4;
    AcceptReceived: 5;
    Active: 6;
    ActiveElsewhere: 7;
    Ending: 13;
}>;
export { CallState };
export { __default as default };
