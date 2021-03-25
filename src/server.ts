import { Expression } from "../node_modules/typescript/lib/typescript";
import express from "express";
const path = require("path");
const http = require("http");
// const express = require('express');
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {v4 : uuidV4, validate : uuidValidate} = require("uuid"); 

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
  ["/solo", "/solo.html"],
  (req: express.Request, res: express.Response) => {
    res.sendFile("solo.html", {
      root: path.join(__dirname, "../", "public"),
    });
  }
);

app.get(
  ["/loadPage.html*", "/loadPage.html"],
  (req: express.Request, res: express.Response) => {
    res.sendFile("loadPage.html", {
      root: path.join(__dirname, "../", "public"),
    });
    // res.sendFile(path.join("public", "index.html"));
  }
);

app.get(["/multiplayer", "/multiplayer.html"], (req: express.Request, res: express.Response) => {
  console.log(`originalUrl:${req.originalUrl}`) // should be like /multiplayer?name=d&hopping=a
  var url : URL = new URL(req.originalUrl);
  console.log(`search url:${url.search}`); // should be like ?name=a&hopping=a
  var redirect_url : string = req.path + `/${uuidV4()}` + url.search; 
  res.redirect(redirect_url);
})

app.get(["/multiplayer/:roomID", "/multiplayer.html/:roomID"], (req: express.Request, res: express.Response) => {
  if (uuidValidate(req.params.roomID)) {
    res.sendFile("multiplayer.html", {
      root: path.join(__dirname, "../", "public"),
    });
  }
  else res.redirect("/404"); 
})

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
  res.status(404);
  res.sendFile("404.html", { root: path.join(__dirname, "../", "public") });
  // next();
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
  res.sendFile("404.html", { root: path.join(__dirname, "../", "public") });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
