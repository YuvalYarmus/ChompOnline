"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path = require("path");
var http = require("http");
// const express = require('express');
var socketio = require("socket.io");
var app = express_1.default();
var server = http.createServer(app);
var io = socketio(server);
// Set static folder
app.use(express_1.default.static(path.join(__dirname, "../", "public")));
// var serveStatic = require("serve-static");
// app.use(serveStatic(path.join(__dirname, "../", "public")))
console.log("path is " + path.join(__dirname, "../", "public"));
console.log("about to handle requests");
// Handle GET requests
app.get(["/", "/index", "/index.html"], function (req, res) {
    res.sendFile("index.html", { root: path.join(__dirname, "../", "public") });
    // res.sendFile(path.join("public", "index.html"));
});
app.get(["/loadPage.html*", "/loadPage.html"], function (req, res) {
    res.sendFile("loadPage.html", { root: path.join(__dirname, "../", "public") });
    // res.sendFile(path.join("public", "index.html"));
});
// app.get("*/css/index.css", (req: express.Request, res: express.Response) => {
//   res.sendFile("/css/index.html", { root: "./public" });
//   // res.sendFile(path.join("public", "index.html"));
// });
// app.get("*/output/index.js", (req: express.Request, res: express.Response) => {
//   res.sendFile("/output/index.js", { root: "./public" });
//   // res.sendFile(path.join("public", "index.html"));
// });
app.get("*/404", function (req, res, next) {
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    next();
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
    res.send("what???");
});
var PORT = process.env.PORT || 3000;
server.listen(PORT, function () { return console.log("Server running on port " + PORT); });
