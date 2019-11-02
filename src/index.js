import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import bookFactory from "./bookFactory";
import { HashRouter as Router } from "react-router-dom";

const AppWithRouter = () => {
  return (
    <div style={{marginLeft:"5%",marginRight:"5%"}}>
      <Router>
        <App bookFactory={bookFactory} />
      </Router>
    </div>
  );
};
ReactDOM.render(<AppWithRouter />, document.getElementById("root"));
