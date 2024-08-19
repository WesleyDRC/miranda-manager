import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import reportWebVitals from "./reportWebVitals";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./reset.css";
import "./variables.css";

const isDevelopment = process.env.NODE_ENVIROMENT === "development";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    {isDevelopment ? (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) : (
      <App />
    )}
    
    <ToastContainer
      theme="dark"
      closeOnClick
      style={{
        fontSize: "12px",
      }}
      pauseOnHover
    />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
