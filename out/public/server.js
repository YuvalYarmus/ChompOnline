import express from "express";
// const express = require('express');
const path = require("path");
const http = require("http");
// const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { v4: uuidV4, validate: uuidValidate } = require("uuid");
// const {formatMessage : formatMessage, formatedMessage : formatedMessage }= require("./messages");
// const formatedMessage = require("../public/output/Util/messages.js")
const formatedMessage = require("./Util/messages");
// import {formatedMessage} from "./Util/messages.js";
var log_get = false;
// socket io handles
// on client connection
io.on(`connection`, (WebSocket) => {
    console.log("new web socket connection");
    WebSocket.emit(`message`, `Welcome to Chomp Online!`);
    WebSocket.broadcast.emit(`message`, `A user has joined the room`);
    WebSocket.on(`disconnect`, () => {
        io.emit(`message`, `A user has left the room`);
    });
    WebSocket.on(`ChatMessage`, (msg) => {
        io.emit(`message`, new formatedMessage("take from db", msg));
    });
});
// console.log("path is " + path.join(__dirname, "../", "public"));
// console.log("about to handle Requests");
// Handle GET Requests
app.get(["/", "/index", "/index.html", "/public/index.html"], (req, res) => {
    if (log_get === true)
        console.log("initial get any"); // @ts-ignore
    res.sendFile("index.html", { root: path.join(__dirname, "../", "public") });
    // res.sendFile(path.join("public", "index.html"));
});
app.get(["/index.js", "/public/output/index.js", "/output/index.js"], (req, res) => {
    if (log_get === true)
        console.log("index.js req");
    res.sendFile("index.js", {
        root: path.join(__dirname, "../", "public/output"),
    });
});
app.get(["/loader.js", "/public/output/loader.js", "/output/loader.js"], (req, res) => {
    if (log_get === true)
        console.log("loader.js req");
    res.sendFile("loader.js", {
        root: path.join(__dirname, "../", "public/output"),
    });
});
app.get(["/loader2.js", "/public/output/loader2.js", "/output/loader2.js"], (req, res) => {
    if (log_get === true)
        console.log("loader2.js req");
    res.sendFile("loader2.js", {
        root: path.join(__dirname, "../", "public/output"),
    });
});
app.get(["/solo.js", "/public/output/solo.js", "/output/solo.js"], (req, res) => {
    if (log_get === true)
        console.log("solo.js req");
    res.sendFile("solo.js", {
        root: path.join(__dirname, "../", "public/output"),
    });
});
app.get(["/three.min.js", "/public/output/three.min.js", "/output/three.min.js"], (req, res) => {
    if (log_get === true)
        console.log("three.min.js req");
    res.sendFile("three.min.js", {
        root: path.join(__dirname, "../", "public/output"),
    });
});
app.get(["/index.css", "/public/css/index.css", "/css/index.css"], (req, res) => {
    if (log_get === true)
        console.log("index.css req");
    res.sendFile("index.css", {
        root: path.join(__dirname, "../", "public/css"),
    });
});
app.get(["/loader.css", "/public/css/loader.css", "/css/loader.css"], (req, res) => {
    if (log_get === true)
        console.log("loader.css req");
    res.sendFile("loader.css", {
        root: path.join(__dirname, "../", "public/css"),
    });
});
app.get(["/solo.css", "/public/css/solo.css", "/css/solo.css"], (req, res) => {
    if (log_get === true)
        console.log("solo.css req");
    res.sendFile("solo.css", {
        root: path.join(__dirname, "../", "public/css"),
    });
});
app.get([
    "/multiplayer.js",
    "/public/output/multiplayer.js",
    "/output/multiplayer.js",
], (req, res) => {
    if (log_get === true)
        console.log("multiplayer.js req");
    res.sendFile("multiplayer.js", {
        root: path.join(__dirname, "../", "public/output"),
    });
});
app.get(["/multiplayer.css", "/public/css/multiplayer.css", "/css/multiplayer.css"], (req, res) => {
    if (log_get === true)
        console.log("multiplayer.css req");
    res.sendFile("multiplayer.css", {
        root: path.join(__dirname, "../", "public/css"),
    });
});
app.get(["/solo", "/solo.html", "/public/solo.html"], (req, res) => {
    res.sendFile("solo.html", {
        root: path.join(__dirname, "../", "public"),
    });
});
app.get(["/loadPage.html*", "/loadPage.html", "/public/loadPage.html"], (req, res) => {
    if (log_get === true)
        console.log("moving to the loading page");
    res.sendFile("loadPage.html", {
        root: path.join(__dirname, "../", "public/"),
    });
    // res.sendFile(path.join("public", "index.html"));
});
app.get(["/multiplayer", "/multiplayer.html"], (req, res) => {
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
            root: path.join(__dirname, "../", "public"),
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
    res.sendFile("404.html", { root: path.join(__dirname, "../", "public") });
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
app.get("*", function (req, res) {
    res.status(404);
    res.send("what???");
});
app.get("/public/*", function (req, res) {
    res.status(404);
    res.sendFile("404.html", { root: path.join(__dirname, "../", "public") });
});
// var serveStatic = require("serve-static");
// app.use(serveStatic(path.join(__dirname, "../", "public")))
// Set static folder
app.use(express.static(path.join(__dirname, "../", "public")));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
