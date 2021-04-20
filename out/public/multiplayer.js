import Game from "./Game.js";
var gotName = false;
// var ip = '127.0.0.1:3000';
// var socket = io.connect(ip);
const socket = io().connect();
const chatForm = document.getElementById("chat-form");
if (chatForm === null)
    alert("is null");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
socket.on(`message`, (message) => {
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
socket.on(`ChatMessage`, (message) => {
    console.log(`in ChatMessage with:${message}`);
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
// Get room and users
socket.on('outputRoom', (room) => {
    outputRoomName(room);
});
socket.on('outputUsers', (users) => {
    outputUsers(users);
});
chatForm.addEventListener(`submit`, (e) => {
    e.preventDefault();
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
    // p.innerText = message.msg.username;
    // p.innerHTML += `<span>${message.msg.time}</span>`;
    p.innerHTML = `<span>${message.msg.username}</span><span>${message.msg.time}</span>`;
    div.appendChild(p);
    const para = document.createElement("p");
    para.classList.add("text");
    para.innerText = message.msg.text;
    div.appendChild(para);
    document.querySelector(".chat-messages").appendChild(div);
}
// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.name;
        userList.appendChild(li);
    });
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
    // console.log(window.location.search);
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
});
if (getURLParam("full_name") != null) {
    const { full_name } = Qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    let path = document.location.pathname.split("/");
    let room_uuid = path[path.length - 1];
    socket.emit('joinRoom', { room_uuid, full_name });
    var game = new Game();
    document.getElementById(`playAgainBtn`)?.addEventListener("click", () => {
        console.log(`\nrestarting game\n`);
        game = new Game();
    });
}
else {
    console.log(`didnt go to gotName if:${gotName}`);
}
