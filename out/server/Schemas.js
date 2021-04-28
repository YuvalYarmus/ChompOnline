"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Room = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    current_room: {
        type: String,
        required: false
    }
}, { timestamps: true, autoIndex: true });
const userListSchema = new Schema({
    user_list: {
        type: [userSchema],
        required: true,
        default: []
    }
});
const roomSchema = new Schema({
    population: {
        type: Number,
        required: true
    },
    uuid: {
        type: String,
        require: true
    },
    users: {
        type: [userSchema],
        required: false,
        default: []
    },
    gameState: {
        type: [[]],
        required: true,
        default: [[]]
    },
    currTurn: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });
exports.Room = mongoose_1.default.model("Room", roomSchema);
exports.User = mongoose_1.default.model("User", userSchema);
// module.exports = {
//     Room, UserList, User
// };
