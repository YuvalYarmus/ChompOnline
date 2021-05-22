declare var Qs: any;
import { msgObject, formatedMessage } from "../common/messages";
import {Game} from "./Game.js";
var gotName = false;
// var ip = '127.0.0.1:3000';
// var socket = io.connect(ip);
const socket = io().connect();
const chatForm = document.getElementById("chat-form");
if (chatForm === null) alert("is null");
const chatMessages = document.querySelector(".chat-messages")!;
const roomName = document.getElementById("room-name")!;
const userList = document.getElementById("users")!;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const chatAudio = document.createElement(`audio`);
document.getElementById("soundControl")!.innerHTML = `
<label class="switch">
<input id="soundSett" type="checkbox" checked>
<span class="slider"></span>
</label>`
;
chatAudio.src = "../../chat.mp3";
const gameAudio = document.createElement(`audio`);
gameAudio.src = "../../gameTurn.mp3";

var soundOn = true;
document.getElementById("soundSett")!.addEventListener(`change`, () => {
  soundOn = !soundOn;
});

socket.on(`message`, (message: formatedMessage) => {
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on(`ChatMessage`, (message: formatedMessage) => {
  console.log(`in ChatMessage with:${message}`);
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Get room and users
socket.on("outputRoom", (room: string) => {
  outputRoomName(room);
});
socket.on("outputUsers", (users: []) => {
  outputUsers(users);
});

chatForm!.addEventListener(`submit`, (e: Event) => {
  e.preventDefault();
  const msgElement: HTMLInputElement = <HTMLInputElement>(
    document.getElementById("msg")!
  );
  var msg = msgElement.value;
  socket.emit(`ChatMessage`, msg);
  msgElement.value = "";
  msgElement.focus();
});

function outputMessage(message: formatedMessage) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  if (message.msg === undefined || message.msg == null)
    alert(`message.msg is undefined or null:   ${message}`);
  // p.innerText = message.msg.username;
  // p.innerHTML += `<span>${message.msg.time}</span>`;
  p.innerHTML = `<span>${message.msg.username}</span><span>${message.msg.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.msg.text;
  div.appendChild(para);
  document.querySelector(".chat-messages")!.appendChild(div);
  if (soundOn) chatAudio.play();
}

// Add room name to DOM
function outputRoomName(room: string) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users: []) {
  userList.innerHTML = "";
  users.forEach((user: any) => {
    const li = document.createElement("li");
    li.innerText = user.name;
    userList.appendChild(li);
  });
}

function execCopy() {
  var input = document.createElement("input") as HTMLInputElement;
  var copyText =
    document.location.href.split("?")[0] +
    `?invited=true&n=${getURLParam("n")}&m=${getURLParam("m")}`;
  input.value = copyText;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(input);

  var tooltip = document.getElementById("myTooltip")!;
  tooltip.innerHTML = "Copied: " + copyText;
}

function hoverCopy() {
  var tooltip = document.getElementById("myTooltip")!;
  tooltip.innerHTML = "Copy to clipboard";
}

const copyBtn = document.getElementById("copyBtn");
copyBtn?.addEventListener(`click`, () => {
  execCopy();
});
copyBtn?.addEventListener(`mouseout`, () => {
  hoverCopy();
});

function getURLParam(paramName: string) {
  let params = new URLSearchParams(window.location.search);
  // console.log(window.location.search);
  return params.get(paramName);
}

window.addEventListener(`load`, () => {
  if (getURLParam("full_name") === null) {
    let name: string = prompt(`please insert your name: `) || "John Doe";
    var add = "";
    if (document.location.search === "") add = `?full_name=${name}`;
    else if (getURLParam("invited")) add = `&full_name=${name}`;
    else add = "/404";
    window.location.href += add;
  } else gotName = true;
});

if (getURLParam("full_name") != null) {
  const { full_name, n, m } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  console.log(`full_name is ${full_name}, n is ${n}, m is ${m}`);
  let path: string[] = document.location.pathname.split("/");
  let room_uuid: string = path[path.length - 1];
  socket.emit("joinRoom", { room_uuid, full_name });
  var game = new Game(n, m);
  canvas.addEventListener("click", (e) => {
    game.clickFunc(e);
    let turns = game.turns, gameState = game.globalGameState.array; 
    socket.emit("makeMove", {gameState, turns, room_uuid});
  });
  type boolState = boolean[][];
  socket.on(`passMove`, (gameState : boolState) => {
    game.globalGameState.array =  gameState;
    game.updateShapesDrawStateByArray(gameState);
    game.drawShapes();
    if (soundOn) gameAudio.play();
  });
  socket.on(`fixBoard`, (gameState : boolState) => {
    game.globalGameState.array =  gameState;
    game.updateShapesDrawStateByArray(gameState);
    game.drawShapes();
    if (soundOn) gameAudio.play();
  });
  document.getElementById(`playAgainBtn`)?.addEventListener("click", () => {
    socket.emit(`restartGame`, room_uuid);
    console.log(`\nrestarting game\n`);
    game = new Game(n, m);
    document.getElementById("Holder2")!.setAttribute("x-data", "{ open: false }");
  });
} else {
  console.log(`didnt go to gotName if:${gotName}`);
}
