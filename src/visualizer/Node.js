import React, { Component } from "react";
import "./Node.css";
export default class Node extends Component {
  render() {
    const { col, row, isStart, isEnd, isVisited } = this.props;

    const extendedClass = isStart
      ? "startNode"
      : isEnd
      ? "endNode"
      : isVisited
      ? "node-visited"
      : "";

    return (
      <td id={`node-${row}-${col}`} className={`node ${extendedClass}`}></td>
    );
  }
}
