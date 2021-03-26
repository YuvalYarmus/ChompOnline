"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatedMessage = void 0;
const moment = require('moment');
class formatedMessage {
    constructor(username, text) {
        this.msg = {
            username,
            text,
            time: moment().format('h:mm a')
        };
    }
    getWholeMessage() {
        return `${this.msg.time} ${this.msg.username} ${this.msg.text}`;
    }
    jsonParse() { return JSON.parse(this.msg.toString()); }
    getMessageText() { return this.msg.text.toString(); }
    getMessageTime() { return this.msg.time.toString(); }
    getMessageUserName() { return this.msg.username.toString(); }
}
exports.formatedMessage = formatedMessage;
function formatMessage(username, text) {
    // return new formatedMessage(username, text);
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}
