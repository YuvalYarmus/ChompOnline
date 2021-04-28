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

type boolState = boolean[][];
export interface RoomDoc extends mongoose.Document {
    population: number;
    uuid: string;
    users: [UserDoc];
    gameState : boolState;
    currTurn : number;
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
    },
    gameState: {
        type: [[]],
        required: true,
        default: [[]]
    },
    currTurn: {
        type : Number,
        required: true,
        default : 0
    }
}, { timestamps: true });


export const Room = mongoose.model<RoomDoc>("Room", roomSchema);
export const User = mongoose.model<UserDoc>("User", userSchema);

// module.exports = {
//     Room, UserList, User
// };