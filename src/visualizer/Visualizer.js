import React, { Component } from "react";
import Node from "./Node";
import "./Visualizer.css";
import { bfs } from "../algorithm/bfs";
//import { getElementError } from "@testing-library/react";

export default class Visualizer extends Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      numOfRows: 20,
      numOfColumns: 40,
      endNodeRow: 5,
      startNodeRow: 5,
      endNodeCol: 30,
      startNodeCol: 5,
      startNode: false,
      endNode: false,
      isVisited: false,
    };
  }
  // Grid Formation begin ..
  componentDidMount() {
    const nodes = this.InitialTable();
    this.setState({
      nodes,
    });
  }

  InitialTable = () => {
    const rows = this.state.numOfRows;
    const cols = this.state.numOfColumns;
    const nodes = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(this.createNode(i, j));
      }
      nodes.push(row);
    }
    console.log(document.getElementById(`node-${nodes[5]}-${5}`));
    return nodes;
  };

  createNode = (row, col) => {
    return {
      row,
      col,
      startNode:
        col === this.state.startNodeCol && row === this.state.endNodeRow,
      endNode: col === this.state.endNodeCol && row === this.state.endNodeRow,
      isVisited: false,
    };
  };
  //grid Formation ends...

  // visualizing part begins...

  animateDijkstra(visitedNodesInOrder) {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      // if (i === visitedNodesInOrder.length) {
      //   setTimeout(() => {
      //     this.animateShortestPath(nodesInShortestPathOrder);
      //   }, 10 * i);
      //   return;
      // }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        //console.log(node.row);
        if (
          !(
            document.getElementById(`node-${node.row}-${node.col}`)
              .className === "node startNode"
          ) &&
          !(
            document.getElementById(`node-${node.row}-${node.col}`)
              .className === "node endNode"
          )
        )
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
      }, 10 * i);
    }
  }

  visualize(algorithm) {
    const {
      nodes,
      startNodeRow,
      startNodeCol,
      endNodeRow,
      endNodeCol,
    } = this.state;
    const beginningNode = nodes[startNodeRow][startNodeCol];
    //console.log(beginningNode);
    const enddingNode = nodes[endNodeRow][endNodeCol];
    if (algorithm === "bfs") {
      let visitedNodeInOrder = bfs(nodes, beginningNode, enddingNode);
      this.animateDijkstra(visitedNodeInOrder);
      //console.log(visitedNodeInOrder[0]);
    }
  }

  // visualization ends ..

  render() {
    const { nodes } = this.state;
    return (
      <div>
        <button
          onClick={() => {
            this.visualize("bfs");
          }}
          id="visualize-btn"
          className="btn btn-success"
        >
          {" "}
          Visualize{" "}
        </button>
        <table className="grid-container">
          <tbody>
            {nodes.map((row, rowId) => {
              return (
                <tr key={rowId}>
                  {row.map((cell, cellId) => {
                    const { row, col, isVisited, startNode, endNode } = cell;
                    return (
                      <Node
                        key={cellId}
                        row={row}
                        col={col}
                        isVisited={isVisited}
                        isStart={startNode}
                        isEnd={endNode}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
