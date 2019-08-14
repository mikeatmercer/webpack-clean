require('es6-object-assign').polyfill();

import "./style.css";
//import modTest from "./module";
import App from "./App";
import habitat from "preact-habitat";


/*
var thing = document.createElement('div');
thing.innerText = "tds ks"

document.body.appendChild(thing);

modTest(); 
*/



let _habitat = habitat(App);



_habitat.render({

  selector: '[data-widget-host="habitat"]',

  clean: true

})