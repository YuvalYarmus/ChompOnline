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
document.write("<h1 style=\"text-align: center\">" + getURLParam("hopping") + "</h1>");
setTimeout(redirect, 3000);
function redirect() {
    if (getURLParam("hopping") === null) {
        // var node= document.getElementById("html")!;
        // node.querySelectorAll('h1').forEach(n => n.remove());
        // document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(tag => tag.remove());
        // node.appendChild(document.createElement("<h1>Missing a param. Please go back to the previous page.</h1>")); 
        var error_message = "<h1 style=\"text-align: center\">Missing a param. Please go back to the previous page.</h1>";
        if (document.querySelector("h1"))
            document.querySelector("h1").innerHTML = error_message;
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
// import * as Three from 'https://unpkg.com/Three@<version>/build/Three.module.js';
// import Three from "/node_modules/";
// const Three = require("Three-js"); 
// const scene1 = new THREE.Scene();
// let camera : any, scene : any, renderer : any;
// let geometry, material, mesh : any;
// let deltaTime, clock : any;
// init();
// function init() {
//   initScene();
//   initHemiLight();
//   initDirLight();
//   initCube();
//   initClock();
//   initRenderer();
// }
// function initScene() {
//   camera = new Three.PerspectiveCamera(
//     70,
//     window.innerWidth / window.innerHeight,
//     0.01,
//     10
//   );
//   camera.position.z = 1;
//   scene = new Three.Scene();
//   scene.background = new Three.Color('rgb(0,0,0)');
// }
// function initHemiLight() {
//   const hemiLight = new Three.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
//   hemiLight.color.setHSL(0.6, 1, 0.6);
//   hemiLight.groundColor.setHSL(0.095, 1, 0.75);
//   hemiLight.position.set(0, 50, 0);
//   scene.add(hemiLight);
// }
// function initDirLight() {
//   const dirLight = new Three.DirectionalLight(0xffffff, 1);
//   dirLight.color.setHSL(0.1, 1, 0.95);
//   dirLight.position.set(-1, 1.75, 1);
//   dirLight.position.multiplyScalar(30);
//   scene.add(dirLight);
//   dirLight.castShadow = true;
//   dirLight.shadow.mapSize.width = 2048;
//   dirLight.shadow.mapSize.height = 2048;
//   const d = 50;
//   dirLight.shadow.camera.left = -d;
//   dirLight.shadow.camera.right = d;
//   dirLight.shadow.camera.top = d;
//   dirLight.shadow.camera.bottom = -d;
//   dirLight.shadow.camera.far = 3500;
//   dirLight.shadow.bias = -0.0001;
// }
// function initCube() {
//   geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
//   material = new Three.MeshStandardMaterial({ color: 0xffffff });
//   mesh = new Three.Mesh(geometry, material);
//   mesh.castShadow = true;
//   mesh.receiveShadow = true;
//   scene.add(mesh);
// }
// function initClock() {
//   clock = new Three.Clock();
//   deltaTime = 0;
// }
// function initRenderer() {
//   renderer = new Three.WebGLRenderer({ antialias: true });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setAnimationLoop(animation);
//   document.body.appendChild(renderer.domElement);
//   renderer.outputEncoding = Three.sRGBEncoding;
//   renderer.shadowMap.enabled = true;
//   window.addEventListener("resize", () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   });
// }
// function animation() {
//   deltaTime = clock.getDelta();
//   const deltaHeight =
//     Math.sin(clock.elapsedTime + deltaTime) - Math.sin(clock.elapsedTime);
//   mesh.position.y += deltaHeight * 0.05;
//   mesh.rotation.y -= deltaTime * 20 * (Math.PI / 180);
//   renderer.render(scene, camera);
// }
