import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";


const initApp = () => {
  ReactDOM.render(<App />, document.getElementById("app"));
}

const devApp = {
  init: initApp
}

export default devApp