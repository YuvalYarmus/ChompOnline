"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const app = express_1.default();
const server = http.createServer(app);
const io = socketio(server);
const { v4: uuidV4, validate: uuidValidate } = require("uuid");
const messages_1 = require("../common/messages");
// const mongoose = require("mongoose");
const uri = "mongodb+srv://YuvalYarmus:test123@cluster0.793qx.mongodb.net/ChompOnline?retryWrites=true&w=majority&authSource=admin";
const settings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    poolSize: 10,
};
const Schemas_1 = require("./Schemas");
// const { Room } = require("./Schemas");
var log_get = false;
const bot_name = "Chomp Online Bot";
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(uri, settings);
            console.log(`should be connected to db2`);
        }
        catch (error) {
            console.log(`should NOT be connected to db`);
            console.log(`error in db connection:${error}`);
        }
    });
}
connectToDB();
console.log(`should be connected to db`);
function addUserToRoom(socket_id, username, room) {
    return __awaiter(this, void 0, void 0, function* () {
        const new_user = new Schemas_1.User({
            user_id: socket_id,
            name: username,
            current_room: room,
        });
        return new Promise((resolve, reject) => {
            const query = Schemas_1.Room.where({ uuid: room });
            query.findOne(function (err, room) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        reject(`got an error in querying ${err}`);
                    else if (room === null)
                        reject(`no such room found`);
                    else {
                        room.users.push(new_user);
                        room.population += 1;
                        try {
                            const result = yield room.save();
                            if (log_get)
                                console.log(`saved room => result:\n${result}`);
                            resolve(new_user);
                        }
                        catch (err) {
                            reject(`update failed:${err}`);
                        }
                    }
                });
            });
        });
    });
}
function addUserToUsers(socket_id, username, room) {
    return __awaiter(this, void 0, void 0, function* () {
        const new_user = new Schemas_1.User({
            user_id: socket_id,
            name: username,
            current_room: room,
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield new_user.save();
                resolve(new_user);
            }
            catch (err) {
                reject(`error in adding the user to the users db:${err}`);
            }
        }));
    });
}
function createRoom(uuid) {
    return __awaiter(this, void 0, void 0, function* () {
        const room = new Schemas_1.Room({
            population: 0,
            uuid: uuid,
            users: [],
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield room.save();
                if (log_get)
                    console.log(`managed to save the room to the databse:\n${result}`);
                resolve(result);
            }
            catch (err) {
                reject(`got an error in saving a room: ${err}`);
            }
        }));
    });
}
function removeRoomUser(socket_id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`in removeRoomUser`);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield Schemas_1.Room.where({ "users.user_id": `${socket_id}` }).exec(function (err, rooms) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        reject(`got an error in querying ${err}`);
                    else if (!rooms)
                        reject(`no such room found:${rooms}`);
                    else {
                        console.log(`\nrooms is: ${rooms} of type: ${typeof rooms}`);
                        console.info(rooms);
                        rooms.forEach((room, index) => __awaiter(this, void 0, void 0, function* () {
                            if (room === (null || undefined))
                                console.log(`one of the rooms was ${room}`);
                            else {
                                let userToRemove = null, index = -1;
                                for (const [i, user] of room.users.entries()) {
                                    if (user.user_id === socket_id) {
                                        userToRemove = user;
                                        index = i;
                                    }
                                }
                                if (index !== -1) {
                                    const removed = room.users.splice(index, 1);
                                    room.population -= 1;
                                    console.log(`the user which was removed: ${removed}`);
                                    try {
                                        yield room.save();
                                        resolve(removed[0]);
                                    }
                                    catch (err) {
                                        console.log(`\nfailed to save room:${room}\nError:${err}`);
                                        reject(err);
                                    }
                                }
                                else
                                    console.log(`\nthe user wasn't in the room!!!!`);
                            }
                        }));
                    }
                });
            });
        }));
    });
}
function getRoomUsers(uuidRoom) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const query = Schemas_1.Room.where({ uuid: uuidRoom });
            query.findOne(function (err, room) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        reject(`got an error in querying ${err}`);
                    else if (room === null)
                        reject(`no such room found`);
                    else {
                        var usersList = room.users;
                        resolve(usersList);
                    }
                });
            });
        });
    });
}
function removeCurrentUserFromUsers(socket_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const query = Schemas_1.User.where({ "user_id": socket_id.toString() });
            yield query.findOneAndDelete((err, user) => {
                console.log(`\nin removeCurrentUserFromUsers:`);
                console.log(`query is:${query}`);
                console.log(`user is:${user}\n\n`);
                if (err)
                    reject(`got an error in removeFromUsers:${err}\n`);
                else if (user === null)
                    resolve(null);
                else
                    resolve(user);
            });
        }));
    });
}
function getFirstRoomUser(socket_id) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function getCurrentUserFromUsers(socket_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const query = Schemas_1.User.where({ "user_id": socket_id.toString() });
            query.find(function (err, user) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        reject(`got an error in querying ${err}`);
                    else if (user === null)
                        reject(`no such user found`);
                    else {
                        resolve(user);
                    }
                });
            });
        });
    });
}
function handleEmptyRoom(uuidRoom) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = Schemas_1.Room.where({ uuid: uuidRoom });
        query.findOne((err, room) => {
            if (err)
                console.log(`handleEmptyRoom: got an error in querying ${err}`);
            else if (room === null)
                console.log(`handleEmptyRoom: no such room found`);
            else if (room.users.length === 0 || room.users[0] === (null || undefined)) {
                Schemas_1.Room.where({ uuid: uuidRoom }).findOneAndDelete((err, room) => {
                    if (err)
                        console.log(`handleEmptyRoom2: got an error in querying ${err}`);
                    else if (room === null)
                        console.log(`handleEmptyRoom2: no such room found`);
                    else {
                        console.log(`room deleted:${room}`);
                    }
                });
            }
        });
    });
}
// socket io handles
io.on(`connection`, (WebSocket) => {
    // console.log("new web socket connection");
    WebSocket.on("joinRoom", (joinObject) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield addUserToRoom(WebSocket.id, joinObject.full_name, joinObject.room_uuid);
        const copyUser = yield addUserToUsers(WebSocket.id, joinObject.full_name, joinObject.room_uuid);
        WebSocket.join(joinObject.room_uuid);
        const greet_user = new messages_1.formatedMessage(bot_name, `Welcome To Chomp Online ${copyUser.name}!`);
        WebSocket.emit(`message`, greet_user);
        const greet_user_join = new messages_1.formatedMessage(bot_name, `${copyUser.name} has joined the room`);
        WebSocket.broadcast.to(joinObject.room_uuid).emit(`message`, greet_user_join);
        WebSocket.emit(`outputRoom`, joinObject.room_uuid);
        const users = yield getRoomUsers(joinObject.room_uuid);
        io.to(joinObject.room_uuid).emit(`outputUsers`, users);
    }));
    WebSocket.on(`disconnect`, () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield removeCurrentUserFromUsers(WebSocket.id);
        const currentUser2 = yield removeRoomUser(WebSocket.id);
        var name = "A user";
        if (currentUser2 != null)
            name = currentUser2.name;
        if (currentUser2 != null)
            handleEmptyRoom(currentUser2.current_room);
        io.to(currentUser2.current_room).emit(`outputUsers`, yield getRoomUsers(currentUser2.current_room));
        io.emit(`message`, new messages_1.formatedMessage(bot_name, `${name} has left the room`));
    }));
    WebSocket.on(`ChatMessage`, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield getCurrentUserFromUsers(WebSocket.id);
        // query returns a list so the result will be [user]. to grab the name use => currentUser[0].name
        io.to(currentUser[0].current_room.toString()).emit(`ChatMessage`, new messages_1.formatedMessage(currentUser[0].name, msg));
    }));
});
// console.log("path is " + path.join(__dirname, "../../", "html"));
// console.log("about to handle Requests");
// Handle GET Requests
app.get("*/404", function (req, res, next) {
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    if (log_get === true)
        console.log("got 404");
    res.status(404);
    res.sendFile("404.html", { root: path.join(__dirname, "../../", "html") });
    // next();
});
app.get(["/", "/index", "/index.html", "/public/index.html", "./index.html"], (req, res) => {
    if (log_get === true)
        console.log("initial get any"); // @ts-ignore
    res.sendFile(path.join(__dirname, "../../html", "index.html"));
    // res.sendFile("index.html", { root: path.join(__dirname, "../../", "html") });
    // res.sendFile(path.join("public", "index.html"));
});
app.get(["/index.css.map", "/css/index.css.map"], (req, res) => {
    res.sendFile(path.join(__dirname, "../../css", "index.css.map"));
});
app.get("*/index.scss", (req, res) => {
    res.sendFile(path.join(__dirname, "../../css", "index.scss"));
});
app.get([
    "/index.js",
    "/out/public/index.js",
    "/out/index.js",
    "./index.js",
    "./out/public/index.js",
], (req, res) => {
    if (log_get === true)
        console.log(`index.js req: ${req.url}`);
    res.sendFile("index.js", {
        root: path.join(__dirname, "../../out/public"),
    });
});
app.get(["/loader.js", "./out/public/loader.js", "/out/public/loader.js"], (req, res) => {
    if (log_get === true)
        console.log("loader.js req");
    res.sendFile("loader.js", {
        root: path.join(__dirname, "../../", "out/public"),
    });
});
app.get(["/loader2.js", "./out/public/loader2.js", "/out/public/loader2.js"], (req, res) => {
    if (log_get === true)
        console.log("loader2.js req");
    res.sendFile("loader2.js", {
        root: path.join(__dirname, "../../", "out/public"),
    });
});
app.get([
    "/solo.js",
    "./out/public/solo.js",
    "/out/public/solo.js",
    "/out/public/solo",
], (req, res) => {
    if (log_get === true)
        console.log("solo.js req");
    res.sendFile("solo.js", {
        root: path.join(__dirname, "../../", "out/public"),
    });
});
app.get(["/three.min.js", "/out/public/three.min.js", "../out/public/three.min.js"], (req, res) => {
    if (log_get === true)
        console.log("three.min.js req");
    res.sendFile("three.min.js", {
        root: path.join(__dirname, "../../", "out/public"),
    });
});
app.get(["/index.css", "/public/css/index.css", "/css/index.css"], (req, res) => {
    if (log_get === true)
        console.log("index.css req");
    res.sendFile("index.css", {
        root: path.join(__dirname, "../../css"),
    });
    // res.sendFile(path.join(__dirname, '../../css', 'index.scss'));
    // res.sendFile(path.join(__dirname, '../../css', 'index.css.map'));
});
app.get(["/index2.css", "/public/css/index2.css", "/css/index2.css"], (req, res) => {
    console.log("index2.css req");
    res.sendFile("index2.css", {
        root: path.join(__dirname, "../../css"),
    });
});
app.get([
    "/loader.css",
    "/public/css/loader.css",
    "/css/loader.css",
    "./css/loader.css",
], (req, res) => {
    if (log_get === true)
        console.log("loader.css req");
    res.sendFile("loader.css", {
        root: path.join(__dirname, "../../", "css"),
    });
});
app.get(["*/solo.css", "/public/css/solo.css", "/css/solo.css"], (req, res) => {
    if (log_get === true)
        console.log("solo.css req");
    res.sendFile("solo.css", {
        root: path.join(__dirname, "../../", "css"),
    });
});
app.get([
    "./multiplayer.js",
    "/multiplayer.js",
    "/out/public/multiplayer.js",
    "./out/public/multiplayer.js",
], (req, res) => {
    if (log_get === true)
        console.log("multiplayer.js req");
    res.sendFile("multiplayer.js", {
        root: path.join(__dirname, "../../", "out/public"),
    });
});
app.get([
    "/multiplayer.css",
    "/public/css/multiplayer.css",
    "/css/multiplayer.css",
    "./multiplayer.css",
], (req, res) => {
    if (log_get === true)
        console.log("multiplayer.css req");
    res.sendFile("multiplayer.css", {
        root: path.join(__dirname, "../../", "css"),
    });
});
app.get(["/solo", "/solo.html", "/public/solo.html", "./solo"], (req, res) => {
    res.sendFile("solo.html", {
        root: path.join(__dirname, "../../", "html"),
    });
});
app.get(["/loadPage.html*", "/loadPage.html", "/public/loadPage.html"], (req, res) => {
    if (log_get === true)
        console.log("moving to the loading page");
    res.sendFile("loadPage.html", {
        root: path.join(__dirname, "../../", "html"),
    });
    // res.sendFile(path.join("public", "index.html"));
});
app.get(["/multiplayer", "/multiplayer.html", "./multiplayer", "/html/multiplayer.html"], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (log_get === true) {
        console.log(`originalUrl:${req.originalUrl}`); // should be like /multiplayer?name=d&hopping=a
        console.log(`baseUrl:${req.baseUrl}`);
        console.log(`path:${req.path}`);
    }
    // var url : URL = new URL(req.originalUrl); // /multiplayer.html?full_name=Peres
    const url = yield returnRedirectUrl(req, res);
    res.redirect(url);
}));
function returnRedirectUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = req.originalUrl.toString().split("?");
        const paramString = "?" + params[params.length - 1];
        const uuid = uuidV4();
        const redirect_url = `${req.protocol}://${req.get("host")}` +
            req.path +
            `/${uuid}` +
            `${paramString}`;
        if (log_get === true)
            console.log(`redirect_url:${redirect_url}`);
        try {
            const room = yield createRoom(uuid);
            return redirect_url;
        }
        catch (err) {
            console.log(`error in returnRedirectUrl:${err}`);
            return redirect_url;
        }
    });
}
app.get(["/out/public/Game", "./out/public/Game", "/out/public/Game.js"], (req, res) => {
    res.sendFile("Game.js", {
        root: path.join(__dirname, "../../", "out/public"),
    });
});
app.get(["/multiplayer/:roomID", "/multiplayer.html/:roomID", "/html/multiplayer.html/:roomID"], (req, res) => {
    if (uuidValidate(req.params.roomID)) {
        res.sendFile("multiplayer.html", {
            root: path.join(__dirname, "../../", "html"),
        });
    }
    else
        res.redirect("/404");
});
app.get("/403", function (req, res, next) {
    // trigger a 403 error
    var err = new Error("not allowed!");
    err.status = 403;
    next(err);
});
app.get("/500", function (req, res, next) {
    // trigger a generic (500) error
    next(new Error("keyboard cat!"));
});
//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res, next) {
    console.log(`in 404, url is:${req.url}`);
    res.status(404);
    res.send("what???");
});
app.get("/public/*", function (req, res) {
    res.status(404);
    res.sendFile("404.html", { root: path.join(__dirname, "../../", "html") });
});
// var serveStatic = require("serve-static");
// app.use(serveStatic(path.join(__dirname, "../../", "html")))
// Set static folder
app.use(express_1.default.static(path.join(__dirname, "../../", "html")));
app.use(express_1.default.static(path.join(__dirname, "../../", "out/public")));
app.use(express_1.default.static(path.join(__dirname, "../../", "out/common")));
app.use(express_1.default.static(path.join(__dirname, "../../", "out/public")));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
