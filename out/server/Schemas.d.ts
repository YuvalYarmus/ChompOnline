import mongoose from "mongoose";
export interface UserDoc extends mongoose.Document {
    user_id: string;
    name: string;
    current_room: string;
}
declare type boolState = boolean[][];
export interface RoomDoc extends mongoose.Document {
    population: Number;
    uuid: string;
    users: [UserDoc];
    gameState: boolState;
    currTurn: Number;
    n: Number;
    m: Number;
}
export declare const Room: mongoose.Model<RoomDoc, {}>;
export declare const User: mongoose.Model<UserDoc, {}>;
export {};
