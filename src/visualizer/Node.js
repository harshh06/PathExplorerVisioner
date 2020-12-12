import React, { Component } from "react";
import "./Node.css";
export default class Node extends Component {
  render() {
    const {
      col,
      row,
      isStart,
      isEnd,
      isVisited,
      isWall,
      onMouseUp,
      onMouseDown,
      onMouseEnter,
    } = this.props;

    const extendedClass = isStart
      ? "startNode"
      : isEnd
      ? "endNode"
      : isVisited
      ? "node-visited"
      : isWall
      ? "node-wall"
      : "";

    return (
      <td
        id={`node-${row}-${col}`}
        className={`node ${extendedClass}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></td>
    );
  }
}
