export declare type msgObject = {
    username: string;
    text: string;
    time: string;
};
export declare class formatedMessage {
    msg: msgObject;
    constructor(username: string, text: string);
    getWholeMessage(): string;
    jsonParse(): any;
    getMessageText(): string;
    getMessageTime(): string;
    getMessageUserName(): string;
}
