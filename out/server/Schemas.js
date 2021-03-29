"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserList = exports.Room = void 0;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
}, { timestamps: true });
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
    }
}, { timestamps: true });
exports.Room = mongoose.model("Room", roomSchema);
exports.UserList = mongoose.model("UserList", userListSchema);
exports.User = mongoose.model("User", userSchema);
// module.exports = {
//     Room, UserList, User
// };
