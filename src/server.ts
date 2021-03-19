import { Expression } from "../node_modules/typescript/lib/typescript";
import express from "express";
const path = require("path");
const http = require("http");
// const express = require('express');
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "../", "public")));

// var serveStatic = require("serve-static");
// app.use(serveStatic(path.join(__dirname, "../", "public")))

console.log("path is " + path.join(__dirname, "../", "public"));
console.log("about to handle requests");

// Handle GET requests
app.get(
  ["/", "/index", "/index.html"],
  (req: express.Request, res: express.Response) => {
    res.sendFile("index.html", { root: path.join(__dirname, "../", "public") });
    // res.sendFile(path.join("public", "index.html"));
  }
);


app.get(
  ["/loadPage.html*", "/loadPage.html"],
  (req: express.Request, res: express.Response) => {
    res.sendFile("loadPage.html", { root: path.join(__dirname, "../", "public") });
    // res.sendFile(path.join("public", "index.html"));
  }
);

// app.get("*/css/index.css", (req: express.Request, res: express.Response) => {
//   res.sendFile("/css/index.html", { root: "./public" });
//   // res.sendFile(path.join("public", "index.html"));
// });

// app.get("*/output/index.js", (req: express.Request, res: express.Response) => {
//   res.sendFile("/output/index.js", { root: "./public" });
//   // res.sendFile(path.join("public", "index.html"));
// });

app.get("/404", function (req, res, next) {
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

app.get("/403", function (req, res, next) {
  // trigger a 403 error
  var err: any = new Error("not allowed!");
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
