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
    var params = new URLSearchParams(window.location.search);
    return params.get(paramName);
}
document.write("<h1 style=\"background:'black'\">" + getURLParam("hopping") + "</h1>");
setTimeout(redirect, 3000);
function redirect() {
    if (getURLParam("hopping") === null) {
        var node = document.getElementById("html");
        node.querySelectorAll('*').forEach(function (n) { return n.remove(); });
        node.innerHTML = "<h1>Missing a param. Please go back to the previous page.</h1>";
    }
    else {
        var pages = getURLParam("hopping");
        if (pages.toString().toLowerCase() === "a") {
        }
        else if (pages.toString().toLowerCase() === "b") {
        }
        else if (pages.toString().toLowerCase() === "c") {
        }
    }
}
