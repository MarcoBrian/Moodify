import React, { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom"; 
import Dashboard from "./Dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import SpotifyLogin from "./SpotifyLogin";



const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = "";


const timeout = hash.expires_in
const code = hash.access_token; 

function App() {
    return code ? <Dashboard code={code} timeout={timeout}/> : <SpotifyLogin/> 
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
