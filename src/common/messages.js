(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatMessage = exports.formatedMessage = void 0;
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
        getMessageText() { return this.msg.text; }
        getMessageTime() { return this.msg.time; }
        getMessageUserName() { return this.msg.username; }
    }
    exports.formatedMessage = formatedMessage;
    function formatMessage(username, text) {
        return new formatedMessage(username, text);
    }
    exports.formatMessage = formatMessage;
});
