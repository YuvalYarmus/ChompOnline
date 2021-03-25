
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

function getURLParam(paramName : string) {
    let params = new  URLSearchParams(window.location.search);
    console.log(window.location.search)
    return params.get(paramName);
}

// document.write("<h1 style=\"text-align: center\">" + getURLParam("hopping") + "</h1>");
setTimeout(redirect, 500);
function redirect() {
    console.log("in redirect")
    if (getURLParam("hopping") === null) {
        // var node= document.getElementById("html")!;
        // node.querySelectorAll('h1').forEach(n => n.remove());
        // document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(tag => tag.remove());
        // node.appendChild(document.createElement("<h1>Missing a param. Please go back to the previous page.</h1>")); 
        let error_message:string = "<h1 style=\"text-align: center\">Missing a param. Please go back to the previous page.</h1>"; 
        if (document.querySelector("h1")) document.querySelector("h1")!.innerHTML = error_message; 
        let curr_url : string = window.location.href; 
        let list : string[] = curr_url.split("/")
        let end_url : string = curr_url.substring(0, curr_url.length - list[list.length - 1].length) + "404"; 
        window.location.replace(end_url);
    }
    else {
        console.log("in redirect else statement")
        let page : string = "./loadPage.html"; 
        var pages : string = getURLParam("hopping")!;
        if (pages.toString().toLowerCase() === "a") {
            window.location.replace("./solo.html")
        }
        else if (pages.toString().toLowerCase() === "b") {
            var url : URL = new URL(window.location.href);
            page = "/multiplayer.html" + `${url.search}`;
        }
        else if (pages.toString().toLowerCase() === "c") {
            
        }
        else  {
            window.location.replace(window.location.href + "/404")
        }
        let text : string = `
        <main class="join-main">
        <form id="form" class="form" action="${page}">
            <input id="full_name" placeholder="Plese enter your name" name="full_name" required>
            <button type="submit" class="btn">Start the game!</button>
        </form></main>
        `; 
        var node= document.getElementById("container2")!;
        node.innerHTML = text; 
    }
}


