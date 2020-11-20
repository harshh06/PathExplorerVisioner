import React, { Component } from "react";
import "./Visualizer.css";

export default class Visualizer extends Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      numOfRows: 20,
      numOfColumns: 30,
    };
  }

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
        row.push([]);
      }
      nodes.push(row);
    }
    return nodes;
  };

  render() {
    const { nodes } = this.state;
    return (
      <div>
        <table className="grid-container">
          <tbody>
            {nodes.map((row, rowId) => {
              return (
                <tr key={rowId}>
                  {row.map((cell, cellId) => {
                    return <td key={cellId}></td>;
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
