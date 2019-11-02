import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import bookFactory from "./bookFactory";
import { HashRouter as Router } from "react-router-dom";

const AppWithRouter = () => {
  return (
    <Router>
      <App bookFactory={bookFactory} />
    </Router>
  );
};
ReactDOM.render(<AppWithRouter />, document.getElementById("root"));
