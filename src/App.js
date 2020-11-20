import "./App.css";
import React, { Component } from "react";
import Header from "./visualizer/Header";
import Visualizer from "./visualizer/Visualizer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Visualizer />
      </div>
    );
  }
}

export default App;
