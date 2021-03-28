// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// // can now use `require` in an ESM
import Game from "./Game";
var gotName = false;
const socket = io();
// const socket = require("socket.io")();
const chatForm = document.getElementById("chat-form");
if (chatForm === null)
    alert("is null");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
// const formatedMessage = require("./messages");
socket.on(`message`, (message) => {
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
chatForm.addEventListener(`submit`, (e) => {
    e.preventDefault();
    // const msg = (e.target as HTMLFormElement).elements.msg.value;
    const msgElement = (document.getElementById("msg"));
    var msg = msgElement.value;
    socket.emit(`ChatMessage`, msg);
    msgElement.value = "";
    msgElement.focus();
});
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    const p = document.createElement("p");
    p.classList.add("meta");
    if (message.msg === undefined || message.msg == null)
        alert(`message.msg is undefined or null:   ${message}`);
    p.innerText = message.msg.username;
    p.innerHTML += `<span>${message.msg.time}</span>`;
    div.appendChild(p);
    const para = document.createElement("p");
    para.classList.add("text");
    para.innerText = message.msg.text;
    div.appendChild(para);
    document.querySelector(".chat-messages").appendChild(div);
}
function execCopy() {
    var input = document.createElement("input");
    var copyText = document.location.href.split("?")[0] + "?invited=true";
    input.value = copyText;
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(input);
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied: " + copyText;
}
function hoverCopy() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
}
const copyBtn = document.getElementById("copyBtn");
copyBtn?.addEventListener(`click`, () => {
    execCopy();
});
copyBtn?.addEventListener(`mouseout`, () => {
    hoverCopy();
});
function getURLParam(paramName) {
    let params = new URLSearchParams(window.location.search);
    console.log(window.location.search);
    return params.get(paramName);
}
window.addEventListener(`load`, () => {
    if (getURLParam("full_name") === null) {
        let name = prompt(`please insert your name: `) || "John Doe";
        var add = "";
        if (document.location.search === "")
            add = `?full_name=${name}`;
        else if (getURLParam("invited"))
            add = `&full_name=${name}`;
        else
            add = "/404";
        window.location.href += add;
    }
    else
        gotName = true;
    console.log(`after load - gotName:${gotName}`);
});
if (getURLParam("full_name") != null) {
    console.log(`before game`);
    var game = new Game();
}
else {
    console.log(`didnt go to gotName if:${gotName}`);
}
