import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface UserDoc extends mongoose.Document {
    user_id : string;
    name : string;
    current_room : string; 
}

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
}, { timestamps: true, autoIndex : true });

const userListSchema = new Schema({
    user_list: {
        type: [userSchema],
        required: true,
        default: []
    }
});

export interface RoomDoc extends mongoose.Document {
    population: number;
    uuid: string;
    users: [UserDoc];
}

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


export const Room = mongoose.model<RoomDoc>("Room", roomSchema);
export const User = mongoose.model<UserDoc>("User", userSchema);

// module.exports = {
//     Room, UserList, User
// };