import express from "express";
import { ALL } from "node:dns";
import { resolve } from "node:path";
import { stringify } from "qs";
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { v4: uuidV4, validate: uuidValidate } = require("uuid");
import { msgObject, formatedMessage } from "../common/messages";
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://YuvalYarmus:test123@cluster0.793qx.mongodb.net/Rooms?retryWrites=true&w=majority&authSource=admin";
const settings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  poolSize: 10,
};
import { Room, UserList, User } from "./Schemas";
// const { Room } = require("./Schemas");
var log_get = false;
const bot_name = "Chomp Online Bot";

async function connectToDB() {
  try {
    await mongoose.connect(uri, settings);
  } catch (error) {
    console.log(`error in db connection:${error}`);
  }
}

async function addUserToRoom(socket_id: any, username: string, room: string) {
  const new_user: userObject = new User({
    user_id: socket_id,
    name: username,
    current_room: room,
  });
  return new Promise<userObject>((resolve, reject) => {
    const query = Room.where({ uuid: room });
    query.findOne(async function (err: any, room: any) {
      if (err) reject(`got an error in querying ${err}`);
      else if (room === null) reject(`no such room found`);
      else {
        room.users.push(new_user);
        room.population += 1;
        try {
          const result = await room.save();
          if (log_get) console.log(`saved room => result:\n${result}`);
          resolve(new_user);
        } catch (err) {
          reject(`update failed:${err}`);
        }
      }
    });
  });
}

async function addUserToUsers(socket_id: any, username: string, room: string) {
  const new_user = new User({
    user_id: socket_id,
    name: username,
    current_room: room,
  });
  return new Promise<userObject>( async (resolve, reject) => {
    try {
      const result = await new_user.save();
      resolve(new_user);
    } catch (err) {
      reject(`error in adding the user to the users db:${err}`);
    }
  });
}

async function createRoom(uuid: string) {
  const room = new Room({
    population: 0,
    uuid: uuid,
    users: [],
  });
  return new Promise<roomObject>(async (resolve, reject) => {
    try {
      const result = await room.save();
      if (log_get)  console.log(`managed to save the room to the databse:\n${result}`);
      resolve(result);
    } catch (err) {
      reject(`got an error in saving a room: ${err}`);
    }
  });
}

async function removeRoomUser(socket_id:any) {
  
}
async function getRoomUsers(uuidRoom: string) {
  return new Promise<[userObject]>((resolve, reject) => {
    const query = Room.where({ uuid: uuidRoom });
    query.findOne(async function (err: any, room: any) {
      if (err) reject(`got an error in querying ${err}`);
      else if (room === null) reject(`no such room found`);
      else {
        var usersList = room.users;
        resolve(usersList);
      }
    });
  });
}

async function removeCurrentUserFromUsers(socket_id:any) {
  
}
async function getCurrentUserFromUsers(socket_id: any) {
  return new Promise((resolve, reject) => {
    const query = User.where({ "user_id": socket_id.toString() });
    query.find(async function (err: any, user: any) {
      if (err) reject(`got an error in querying ${err}`);
      else if (user === null) reject(`no such user found`);
      else {
        resolve(user);
      }
    });
  });
}

type roomObject = {
  population: number;
  uuid: string;
  users: [userObject];
};
type userObject = {
  user_id: any;
  name: string;
  current_room: string;
};

type joinRoomObject = {
  full_name: string;
  room_uuid: string;
};
connectToDB();
console.log(`should be connected to db`);

// socket io handles
io.on(`connection`, (WebSocket: any) => {
  // console.log("new web socket connection");
  WebSocket.on("joinRoom", async (joinObject: joinRoomObject) => {
    const user = await addUserToRoom(
      WebSocket.id,
      joinObject.full_name,
      joinObject.room_uuid
    );
    const copyUser = await addUserToUsers(
      WebSocket.id,
      joinObject.full_name,
      joinObject.room_uuid
    );
    WebSocket.join(joinObject.room_uuid);

    const greet_user: formatedMessage = new formatedMessage(
      bot_name,
      `Welcome To Chomp Online ${copyUser.name}!`
    );
    WebSocket.emit(`message`, greet_user);
    const greet_user_join: formatedMessage = new formatedMessage(
      bot_name,
      `${copyUser.name} has joined the room`
    );
    WebSocket.broadcast.to(joinObject.room_uuid).emit(`message`, greet_user_join);
    WebSocket.emit(`outputRoom`, joinObject.room_uuid);
    const users = await getRoomUsers(joinObject.room_uuid);
    io.to(joinObject.room_uuid).emit(`outputUsers`, users)
  });

  WebSocket.on(`disconnect`, async () => {
    const currentUser :any = await getCurrentUserFromUsers(WebSocket.id);
    var name = "A user"
    if (currentUser ===  undefined) console.log(`currentUser in disconnect is undefined`);
    else if (currentUser === null)  console.log(`currentUser in disconnect is null`);
    else if (currentUser != (null && undefined) && currentUser[0] === (null || undefined)) {
      console.log(`currentUser in disconnect is not a list`);
      name = currentUser.name;
    }
    else name = currentUser[0].name;
    io.emit(
      `message`,
      new formatedMessage(bot_name, `${name} has left the room`)
    );
  });

  WebSocket.on(`ChatMessage`,async (msg: string) => {
    const currentUser : any = await getCurrentUserFromUsers(WebSocket.id); 
    // query returns a list so the result will be [user]. to grab the name use => currentUser[0].name
    io.to(currentUser[0].current_room.toString()).emit(`ChatMessage`, new formatedMessage(currentUser[0].name, msg));
  });
});

// console.log("path is " + path.join(__dirname, "../../", "html"));
// console.log("about to handle Requests");

// Handle GET Requests
app.get(
  "*/404",
  function (req: express.Request, res: express.Response, next: any) {
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    if (log_get === true) console.log("got 404");
    res.status(404);
    res.sendFile("404.html", { root: path.join(__dirname, "../../", "html") });
    // next();
  }
);
app.get(
  ["/", "/index", "/index.html", "/public/index.html", "./index.html"],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("initial get any"); // @ts-ignore
    res.sendFile(path.join(__dirname, "../../html", "index.html"));
    // res.sendFile("index.html", { root: path.join(__dirname, "../../", "html") });
    // res.sendFile(path.join("public", "index.html"));
  }
);
app.get(
  ["/index.css.map", "/css/index.css.map"],
  (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "../../css", "index.css.map"));
  }
);
app.get("*/index.scss", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "../../css", "index.scss"));
});
app.get(
  [
    "/index.js",
    "/out/public/index.js",
    "/out/index.js",
    "./index.js",
    "./out/public/index.js",
  ],
  (req, res) => {
    if (log_get === true) console.log(`index.js req: ${req.url}`);
    res.sendFile("index.js", {
      root: path.join(__dirname, "../../out/public"),
    });
  }
);
app.get(
  ["/loader.js", "./out/public/loader.js", "/out/public/loader.js"],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("loader.js req");
    res.sendFile("loader.js", {
      root: path.join(__dirname, "../../", "out/public"),
    });
  }
);
app.get(
  ["/loader2.js", "./out/public/loader2.js", "/out/public/loader2.js"],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("loader2.js req");
    res.sendFile("loader2.js", {
      root: path.join(__dirname, "../../", "out/public"),
    });
  }
);
app.get(
  [
    "/solo.js",
    "./out/public/solo.js",
    "/out/public/solo.js",
    "/out/public/solo",
  ],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("solo.js req");
    res.sendFile("solo.js", {
      root: path.join(__dirname, "../../", "out/public"),
    });
  }
);
app.get(
  ["/three.min.js", "/out/public/three.min.js", "../out/public/three.min.js"],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("three.min.js req");
    res.sendFile("three.min.js", {
      root: path.join(__dirname, "../../", "out/public"),
    });
  }
);

app.get(
  ["/index.css", "/public/css/index.css", "/css/index.css"],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("index.css req");
    res.sendFile("index.css", {
      root: path.join(__dirname, "../../css"),
    });
    // res.sendFile(path.join(__dirname, '../../css', 'index.scss'));
    // res.sendFile(path.join(__dirname, '../../css', 'index.css.map'));
  }
);
app.get(
  [
    "/loader.css",
    "/public/css/loader.css",
    "/css/loader.css",
    "./css/loader.css",
  ],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("loader.css req");
    res.sendFile("loader.css", {
      root: path.join(__dirname, "../../", "css"),
    });
  }
);

app.get(
  ["*/solo.css", "/public/css/solo.css", "/css/solo.css"],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("solo.css req");
    res.sendFile("solo.css", {
      root: path.join(__dirname, "../../", "css"),
    });
  }
);
app.get(
  [
    "./multiplayer.js",
    "/multiplayer.js",
    "/out/public/multiplayer.js",
    "./out/public/multiplayer.js",
  ],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("multiplayer.js req");
    res.sendFile("multiplayer.js", {
      root: path.join(__dirname, "../../", "out/public"),
    });
  }
);
app.get(
  [
    "/multiplayer.css",
    "/public/css/multiplayer.css",
    "/css/multiplayer.css",
    "./multiplayer.css",
  ],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("multiplayer.css req");
    res.sendFile("multiplayer.css", {
      root: path.join(__dirname, "../../", "css"),
    });
  }
);

app.get(
  ["/solo", "/solo.html", "/public/solo.html", "./solo"],
  (req: express.Request, res: express.Response) => {
    res.sendFile("solo.html", {
      root: path.join(__dirname, "../../", "html"),
    });
  }
);

app.get(
  ["/loadPage.html*", "/loadPage.html", "/public/loadPage.html"],
  (req: express.Request, res: express.Response) => {
    if (log_get === true) console.log("moving to the loading page");
    res.sendFile("loadPage.html", {
      root: path.join(__dirname, "../../", "html"),
    });
    // res.sendFile(path.join("public", "index.html"));
  }
);

app.get(
  ["/multiplayer", "/multiplayer.html", "./multiplayer"],
  async (req: express.Request, res: express.Response) => {
    if (log_get === true) {
      console.log(`originalUrl:${req.originalUrl}`); // should be like /multiplayer?name=d&hopping=a
      console.log(`baseUrl:${req.baseUrl}`);
      console.log(`path:${req.path}`);
    }
    // var url : URL = new URL(req.originalUrl); // /multiplayer.html?full_name=Peres
    await res.redirect(await returnRedirectUrl(req, res));
  }
);

async function returnRedirectUrl(req: express.Request, res: express.Response) {
  const params: string[] = req.originalUrl.toString().split("?");
  const paramString: string = "?" + params[params.length - 1];
  const uuid = uuidV4();
  const redirect_url =
    `${req.protocol}://${req.get("host")}` +
    req.path +
    `/${uuid}` +
    `${paramString}`;
  if (log_get === true) console.log(`redirect_url:${redirect_url}`);
  try {
    const room: roomObject = await createRoom(uuid);
    return redirect_url;
  } catch (err) {
    console.log(`error in returnRedirectUrl:${err}`);
    return redirect_url;
  }
}

app.get(
  ["/out/public/Game", "./out/public/Game", "/out/public/Game.js"],
  (req: express.Request, res: express.Response) => {
    res.sendFile("Game.js", {
      root: path.join(__dirname, "../../", "out/public"),
    });
  }
);

app.get(
  ["/multiplayer/:roomID", "/multiplayer.html/:roomID"],
  (req: express.Request, res: express.Response) => {
    if (uuidValidate(req.params.roomID)) {
      res.sendFile("multiplayer.html", {
        root: path.join(__dirname, "../../", "html"),
      });
    } else res.redirect("/404");
  }
);

app.get(
  "/403",
  function (req: express.Request, res: express.Response, next: any) {
    // trigger a 403 error
    var err: any = new Error("not allowed!");
    err.status = 403;
    next(err);
  }
);

app.get(
  "/500",
  function (req: express.Request, res: express.Response, next: any) {
    // trigger a generic (500) error
    next(new Error("keyboard cat!"));
  }
);

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req: express.Request, res: express.Response, next: any) {
  console.log(`url:${req.url}`);
  res.status(404);
  res.send("what???");
});

app.get("/public/*", function (req: any, res: any) {
  res.status(404);
  res.sendFile("404.html", { root: path.join(__dirname, "../../", "html") });
});

// var serveStatic = require("serve-static");
// app.use(serveStatic(path.join(__dirname, "../../", "html")))

// Set static folder
app.use(express.static(path.join(__dirname, "../../", "html")));
app.use(express.static(path.join(__dirname, "../../", "out/public")));
app.use(express.static(path.join(__dirname, "../../", "out/common")));
app.use(express.static(path.join(__dirname, "../../", "out/public")));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
