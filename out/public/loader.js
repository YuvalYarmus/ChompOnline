"use strict";
// const form = document.getElementById("form") as HTMLElement;
// form.addEventListener("submit", (e) => {
//     e.preventDefault()
//     const page_string  = getURLParam("hopping") != null; 
//     if (page_string) {
//         let page :string = getURLParam("hopping")!;
//         alert(`page is ${page}`)
//     }
//     e.preventDefault()
// }); 
function getURLParam(paramName) {
    let params = new URLSearchParams(window.location.search);
    console.log(window.location.search);
    return params.get(paramName);
}
// document.write("<h1 style=\"text-align: center\">" + getURLParam("hopping") + "</h1>");
setTimeout(redirect, 500);
function redirect() {
    console.log("in redirect");
    if (getURLParam("hopping") === null) {
        // var node= document.getElementById("html")!;
        // node.querySelectorAll('h1').forEach(n => n.remove());
        // document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(tag => tag.remove());
        // node.appendChild(document.createElement("<h1>Missing a param. Please go back to the previous page.</h1>")); 
        let error_message = "<h1 style=\"text-align: center\">Missing a param. Please go back to the previous page.</h1>";
        if (document.querySelector("h1"))
            document.querySelector("h1").innerHTML = error_message;
        let curr_url = window.location.href;
        let list = curr_url.split("/");
        let end_url = curr_url.substring(0, curr_url.length - list[list.length - 1].length) + "404";
        window.location.replace(end_url);
    }
    else {
        console.log("in redirect else statement");
        let page = "./loadPage.html";
        var pages = getURLParam("hopping");
        if (pages.toString().toLowerCase() === "a") {
            window.location.replace("./solo.html");
        }
        else if (pages.toString().toLowerCase() === "b") {
            var url = new URL(window.location.href);
            // page = "/html/multiplayer.html" + `${url.search}`;
            page = "../../html/multiplayer.html";
        }
        else if (pages.toString().toLowerCase() === "c") {
            page = "../../html/bot.html";
        }
        else {
            window.location.replace(window.location.href + "/404");
        }
        let style = `style="color:grey; padding-top:10px;"`;
        let text = `
        <main class="join-main">
        <form id="form" class="form" action="${page}">
            <input id="full_name" placeholder="Plese enter your name" name="full_name" required>
            <label for="n" ${style}>The amount of columns:</label>
            <input type="number" id="n" value="6" name="n" min="2" max="8">
            <label for="m" ${style}>The amount of rows:</label>
            <input type="number" id="m" value="7" name="m" min="2" max="8">
            <button type="submit" class="btn">Start the game!</button>
        </form></main>
        `;
        var node = document.getElementById("container2");
        node.innerHTML = text;
    }
}
