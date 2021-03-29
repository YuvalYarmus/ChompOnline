import { Mongoose } from "mongoose";

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
        type: [userSchema], // or Array
        required: false,
        default: []
    }
}, { timestamps: true });


export const Room = mongoose.model("Room", roomSchema);
export const UserList = mongoose.model("UserList", userListSchema);
export const User = mongoose.model("User", userSchema);

// module.exports = {
//     Room, UserList, User
// };