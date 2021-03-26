import { time } from "node:console";

const moment = require('moment');

export type msgObject = {
    username : string,
    text : string,
    time : string,
}
export class formatedMessage {
    public msg : msgObject;
    constructor(username : string, text : string) {
        this.msg = {
            username,
            text,
            time: moment().format('h:mm a')
        };
    }
    getWholeMessage() {
        return `${this.msg.time} ${this.msg.username} ${this.msg.text}`
    }
    jsonParse() {   return JSON.parse(this.msg.toString()); }
    getMessageText() {  return this.msg.text.toString();   }
    getMessageTime() {  return this.msg.time.toString();    }
    getMessageUserName() {  return this.msg.username.toString();   }
}
function formatMessage(username : string, text : string) {
    // return new formatedMessage(username, text);
    return {
        username,
        text,
        time: moment().format('h:mm a')
      };
}

