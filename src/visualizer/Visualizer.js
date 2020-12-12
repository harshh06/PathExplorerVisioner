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
      isRunning: false,
      isStartNode: false,
      isEndNode: false,
      isMousePressed: false,
      isWallNode: false,
      currRow: 0,
      currCol: 0,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    //this.toggleIsRunning = this.toggleIsRunning.bind(this);
  }
  // Grid Formation begin ..
  componentDidMount() {
    const nodes = this.InitialTable();
    this.setState({
      nodes,
    });
  }

  // toggleIsRunning() {
  //   this.setState({ isRunning: !this.state.isRunning });
  // }

  InitialTable = () => {
    const rows = this.state.numOfRows;
    const cols = this.state.numOfColumns;
    const initialTable = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(this.createNode(i, j));
      }
      initialTable.push(row);
    }
    //console.log(document.getElementById(`node-${nodes[5]}-${5}`));
    return initialTable;
  };

  createNode = (row, col) => {
    return {
      row,
      col,
      isStartNode:
        col === this.state.startNodeCol && row === this.state.endNodeRow,
      isEndNode: col === this.state.endNodeCol && row === this.state.endNodeRow,
      isVisited: false,
      parentNode: null,
      isNode: true,
      isWall: false,
      distance: Infinity,
      distanceToFinishNode:
        Math.abs(this.state.endNodeRow - row) +
        Math.abs(this.state.endNodeCol - col),
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
            node.distanceToFinishNode =
              Math.abs(this.state.endNodeRow - node.row) +
              Math.abs(this.state.endNodeCol - node.col);
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
              Math.abs(this.state.endNodeRow - node.row) +
              Math.abs(this.state.endNodeCol - node.col);
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

  handleMouseLeave() {
    if (this.state.isStartNode) {
      const isStartNode = !this.state.isStartNode;
      this.setState({ isStartNode, isMousePressed: false });
    } else if (this.state.isEndNode) {
      const isEndNode = !this.state.isEndNode;
      this.setState({ isEndNode, isMousePressed: false });
    } else if (this.state.isWallNode) {
      const isWallNode = !this.state.isWallNode;
      this.setState({ isWallNode, isMousePressed: false });
      this.InitialTable();
    }
  }

  handleMouseDown(row, col) {
    if (!this.state.isRunning) {
      if (this.isGridClear()) {
        if (
          document.getElementById(`node-${row}-${col}`).className ===
          "node startNode"
        ) {
          this.setState({
            isMousePressed: true,
            isStartNode: true,
            currRow: row,
            currCol: col,
          });
        } else if (
          document.getElementById(`node-${row}-${col}`).className ===
          "node endNode"
        ) {
          this.setState({
            isMousePressed: true,
            isEndNode: true,
            currRow: row,
            currCol: col,
          });
        } else {
          const newGrid = getNewGridWithWallToggled(this.state.nodes, row, col);
          this.setState({
            nodes: newGrid,
            isMousePressed: true,
            isWallNode: true,
            currRow: row,
            currCol: col,
          });
        }
      } else {
        this.clearGrid();
      }
    }
  }

  isGridClear() {
    for (const row of this.state.nodes) {
      for (const node of row) {
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`
        ).className;
        if (
          nodeClassName === "node node-visited" ||
          nodeClassName === "node node-shortest-path"
        ) {
          return false;
        }
      }
    }
    return true;
  }

  handleMouseEnter(row, col) {
    if (!this.state.isRunning) {
      if (this.state.isMousePressed) {
        const nodeClassName = document.getElementById(`node-${row}-${col}`)
          .className;
        if (this.state.isStartNode) {
          if (nodeClassName !== "node node-wall") {
            const prevStartNode = this.state.nodes[this.state.currRow][
              this.state.currCol
            ];
            prevStartNode.isStart = false;
            document.getElementById(
              `node-${this.state.currRow}-${this.state.currCol}`
            ).className = "node";

            this.setState({ currRow: row, currCol: col });
            const currStartNode = this.state.nodes[row][col];
            currStartNode.isStart = true;
            document.getElementById(`node-${row}-${col}`).className =
              "node startNode";
          }
          this.setState({ startNodeRow: row, startNodeCol: col });
        } else if (this.state.isEndNode) {
          if (nodeClassName !== "node node-wall") {
            const prevFinishNode = this.state.nodes[this.state.currRow][
              this.state.currCol
            ];
            prevFinishNode.isEnd = false;
            document.getElementById(
              `node-${this.state.currRow}-${this.state.currCol}`
            ).className = "node";

            this.setState({ currRow: row, currCol: col });
            const currFinishNode = this.state.nodes[row][col];
            currFinishNode.isEnd = true;
            document.getElementById(`node-${row}-${col}`).className =
              "node endNode";
          }
          this.setState({ endNodeRow: row, startNodeCol: col });
        } else if (this.state.isWall) {
          const newGrid = getNewGridWithWallToggled(this.state.nodes, row, col);
          this.setState({ nodes: newGrid });
        }
      }
    }
  }

  handleMouseUp(row, col) {
    if (!this.state.isRunning) {
      this.setState({ isMousePressed: false });
      if (this.state.isStartNode) {
        const isStartNode = !this.state.isStartNode;
        this.setState({ isStartNode, startNodeRow: row, startNodeCol: col });
      } else if (this.state.isEndNode) {
        const isEndNode = !this.state.isEndNode;
        this.setState({
          isEndNode,
          endNodeRow: row,
          endNodeCol: col,
        });
      }
      this.InitialTable();
    }
  }

  handleMouseLeave() {
    if (this.state.isStartNode) {
      const isStartNode = !this.state.isStartNode;
      this.setState({ isStartNode, isMousePressed: false });
    } else if (this.state.isEndNode) {
      const isEndNode = !this.state.isEndNode;
      this.setState({ isEndNode, isMousePressed: false });
    } else if (this.state.isWallNode) {
      const isWallNode = !this.state.isWallNode;
      this.setState({ isWallNode, isMousePressed: false });
      this.InitialTable();
    }
  }

  // visualizing part begins...

  animateBFS(visitedNodesInOrder, shortestPathNodeInOrder) {
    //console.log(visitedNodesInOrder.length);
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
        <table
          className="grid-container"
          onMouseLeave={() => this.handleMouseLeave()}
        >
          <tbody>
            {nodes.map((row, rowId) => {
              return (
                <tr key={rowId}>
                  {row.map((cell, cellId) => {
                    const {
                      row,
                      col,
                      isVisited,
                      isStartNode,
                      isEndNode,
                      isWall,
                      isMousePressed,
                    } = cell;
                    return (
                      <Node
                        key={cellId}
                        row={row}
                        col={col}
                        isVisited={isVisited}
                        isStart={isStartNode}
                        isEnd={isEndNode}
                        isMousePressed={isMousePressed}
                        isWall={isWall}
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp(row, col)}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
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

const getNewGridWithWallToggled = (nodes, row, col) => {
  const newGrid = nodes.slice();
  const node = newGrid[row][col];
  if (!node.isStartNode && !node.isEndNode && node.isNode) {
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
  }
  return newGrid;
};
