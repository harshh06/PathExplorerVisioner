import React, { Component } from "react";
import Node from "./Node";
import "./Visualizer.css";
import { bfs, nodesInShortestPath } from "../algorithm/bfs";
import { dfs } from "../algorithm/dfs";
import { dijkstra } from "../algorithm/dijkstra";
import { AStar } from "../algorithm/astar";
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
      isRunning: false,
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
      parentNode: null,
      distance: Infinity,
    };
  };
  //grid Formation ends...

  // clear grid ...

  clearGrid() {
    if (!this.state.isRunning) {
      const newGrid = this.state.nodes.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (
            nodeClassName !== "node startNode" &&
            nodeClassName !== "node endNode" &&
            nodeClassName !== "node node-wall"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
            node.isVisited = false;
            node.distance = Infinity;
            // node.distanceToFinishNode =
            //   Math.abs(this.state.FINISH_NODE_ROW - node.row) +
            //   Math.abs(this.state.FINISH_NODE_COL - node.col);
          }
          if (nodeClassName === "node node-finish") {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode = 0;
          }
          if (nodeClassName === "node node-start") {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(this.state.FINISH_NODE_ROW - node.row) +
              Math.abs(this.state.FINISH_NODE_COL - node.col);
            node.isStart = true;
            node.isWall = false;
            node.previousNode = null;
            node.isNode = true;
          }
        }
      }
    }
  }

  // end clear grid finction

  // visualizing part begins...

  animateBFS(visitedNodesInOrder, shortestPathNodeInOrder) {
    console.log(visitedNodesInOrder.length);
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          this.animateShortestPath(shortestPathNodeInOrder);
        }, 15 * i);
        return;
      }

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
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length - 1; i++) {
      if (nodesInShortestPathOrder[i] === "end") {
        setTimeout(() => {
          this.toggleIsRunning();
        }, i * 50);
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (
            nodeClassName !== "node node-start" &&
            nodeClassName !== "node node-finish"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-shortest-path";
          }
        }, i * 40);
      }
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
      let shortestPathNodeInOrder = nodesInShortestPath(
        visitedNodeInOrder,
        enddingNode
      );
      this.animateBFS(visitedNodeInOrder, shortestPathNodeInOrder);
      console.log(shortestPathNodeInOrder.length);
    } else if (algorithm === "dfs") {
      let visitedNodeInOrder = dfs(nodes, beginningNode, enddingNode);
      let shortestPathNodeInOrder = nodesInShortestPath(
        visitedNodeInOrder,
        enddingNode
      );
      this.animateBFS(visitedNodeInOrder, shortestPathNodeInOrder);
      console.log(shortestPathNodeInOrder.length);
    } else if (algorithm === "dijkstra") {
      let visitedNodeInOrder = dijkstra(nodes, beginningNode, enddingNode);
      let shortestPathNodeInOrder = nodesInShortestPath(
        visitedNodeInOrder,
        enddingNode
      );
      this.animateBFS(visitedNodeInOrder, shortestPathNodeInOrder);
      console.log(shortestPathNodeInOrder.length);
    } else if (algorithm === "astar") {
      let visitedNodeInOrder = AStar(nodes, beginningNode, enddingNode);
      console.log(visitedNodeInOrder.length);
      let shortestPathNodeInOrder = nodesInShortestPath(
        visitedNodeInOrder,
        enddingNode
      );
      this.animateBFS(visitedNodeInOrder, shortestPathNodeInOrder);
      console.log(shortestPathNodeInOrder.length);
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
          BFS{" "}
        </button>
        <button
          onClick={() => {
            this.visualize("dfs");
          }}
          id="visualize-btn"
          className="btn btn-success"
        >
          {" "}
          DFS{" "}
        </button>
        <button
          onClick={() => {
            this.visualize("dijkstra");
          }}
          id="visualize-btn"
          className="btn btn-success"
        >
          {" "}
          Dijkstra{" "}
        </button>
        <button
          onClick={() => {
            this.visualize("astar");
          }}
          id="visualize-btn"
          className="btn btn-success"
        >
          {" "}
          A*{" "}
        </button>
        <button
          onClick={() => {
            this.clearGrid();
          }}
          id="visualize-btn"
          className="btn btn-success"
        >
          {" "}
          Clear grid{" "}
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
