import mongoose from "mongoose";
export interface UserDoc extends mongoose.Document {
    user_id: string;
    name: string;
    current_room: string;
}
export interface RoomDoc extends mongoose.Document {
    population: number;
    uuid: string;
    gameState: string;
    users: [UserDoc];
}
export declare const Room: mongoose.Model<RoomDoc, {}>;
export declare const User: mongoose.Model<UserDoc, {}>;
