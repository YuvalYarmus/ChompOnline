// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// // can now use `require` in an ESM


// import io from 'socket.io-client'; // socket.io-client
import { msgObject, formatedMessage } from "../common/messages";
const socket = io();
// const socket = require("socket.io")();
const chatForm = document.getElementById("chat-form");
if (chatForm === null) alert("is null");
const chatMessages = document.querySelector(".chat-messages")!;
const roomName = document.getElementById("room-name")!;
const userList = document.getElementById("users")!;
// const formatedMessage = require("./messages");

socket.on(`message`, (message: formatedMessage) => {
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// document.getElementById("submitBtn")?.addEventListener(`submit`, (e : Event) => {
//   alert("submit");
//   e.preventDefault();
// });
// document.getElementById("submitBtn")?.addEventListener(`click`, (e : Event) => {
//   alert("submit");
//   e.preventDefault();
// });
chatForm!.addEventListener(`submit`, (e : Event) => {
  e.preventDefault();
  // const msg = (e.target as HTMLFormElement).elements.msg.value;
  const msgElement : HTMLInputElement = <HTMLInputElement>(document.getElementById("msg"))!;
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
  if (message.msg === undefined || message.msg == null) alert(`message.msg is undefined or null:   ${message}`);
  p.innerText = message.msg.username;
  p.innerHTML += `<span>${message.msg.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.msg.text;
  div.appendChild(para);
  document.querySelector(".chat-messages")!.appendChild(div);
}
