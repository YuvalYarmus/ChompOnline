"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const app = express_1.default();
const server = http.createServer(app);
const io = socketio(server);
const { v4: uuidV4, validate: uuidValidate } = require("uuid");
const messages_1 = require("../common/messages");
var log_get = true;
const bot_name = "Chomp Online Bot";
// socket io handles
io.on(`connection`, (WebSocket) => {
    // console.log("new web socket connection");
    const greet_user = new messages_1.formatedMessage(bot_name, "Welcome To Chomp Online!");
    WebSocket.emit(`message`, greet_user);
    const greet_user_join = new messages_1.formatedMessage(bot_name, `A user has joined the room`);
    WebSocket.broadcast.emit(`message`, greet_user_join);
    WebSocket.on(`disconnect`, () => {
        io.emit(`message`, new messages_1.formatedMessage(bot_name, `A user has left the room`));
    });
    WebSocket.on(`ChatMessage`, (msg) => {
        io.emit(`message`, new messages_1.formatedMessage("take from db", msg));
    });
});
// console.log("path is " + path.join(__dirname, "../../", "html"));
// console.log("about to handle Requests");
// Handle GET Requests
app.get(["/", "/index", "/index.html", "/public/index.html"], (req, res) => {
    if (log_get === true)
        console.log("initial get any"); // @ts-ignore
    res.sendFile(path.join(__dirname, '../../html', 'index.html'));
    // res.sendFile("index.html", { root: path.join(__dirname, "../../", "html") });
    // res.sendFile(path.join("public", "index.html"));
});
app.get(["/index.css.map", "/css/index.css.map"], (req, res) => {
    res.sendFile(path.join(__dirname, '../../css', 'index.css.map'));
});
app.get("*/index.scss", (req, res) => {
    res.sendFile(path.join(__dirname, '../../css', 'index.scss'));
});
app.get(["/index.js", "/out/public/index.js", "/out/index.js", "./index.js", "./out/public/index.js"], (req, res) => {
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
app.get(["/solo.js", "./out/public/solo.js", "/out/public/solo.js"], (req, res) => {
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
app.get(["/loader.css", "/public/css/loader.css", "/css/loader.css"], (req, res) => {
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
app.get(["/multiplayer.css", "/public/css/multiplayer.css", "/css/multiplayer.css", "./multiplayer.css"], (req, res) => {
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
app.get(["/multiplayer", "/multiplayer.html", "./multiplayer"], (req, res) => {
    if (log_get === true) {
        console.log(`originalUrl:${req.originalUrl}`); // should be like /multiplayer?name=d&hopping=a
        console.log(`baseUrl:${req.baseUrl}`);
        console.log(`path:${req.path}`);
    }
    // var url : URL = new URL(req.originalUrl); // /multiplayer.html?full_name=Peres
    res.redirect(returnRedirectUrl(req, res));
});
function returnRedirectUrl(req, res) {
    const params = req.originalUrl.toString().split("?");
    const paramString = "?" + params[params.length - 1];
    const redirect_url = `${req.protocol}://${req.get("host")}` +
        req.path +
        `/${uuidV4()}` +
        `${paramString}`;
    if (log_get === true)
        console.log(`redirect_url:${redirect_url}`);
    return redirect_url;
}
app.get(["/multiplayer/:roomID", "/multiplayer.html/:roomID"], (req, res) => {
    if (uuidValidate(req.params.roomID)) {
        res.sendFile("multiplayer.html", {
            root: path.join(__dirname, "../../", "html"),
        });
    }
    else
        res.redirect("/404");
});
app.get("*/404", function (req, res, next) {
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    res.status(404);
    res.sendFile("404.html", { root: path.join(__dirname, "../../", "html") });
    // next();
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
    console.log(`url:${req.url}`);
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
