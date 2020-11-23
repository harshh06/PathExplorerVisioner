//const parentNode = [][];

export function bfs(grid, beginNode, finishNode) {
  let q = [beginNode];
  const visitedNodesInOrder = [beginNode];
  beginNode.isVisited = true;
  while (q.length) {
    let currentNode = q.shift();
    if (currentNode.endNode) {
      return visitedNodesInOrder;
    }
    visitedNodesInOrder.push(currentNode);
    const { row, col } = currentNode;
    if (row > 0 && !grid[row - 1][col].isVisited) {
      q.push(grid[row - 1][col]);
      visitedNodesInOrder.push(grid[row - 1][col]);
      grid[row - 1][col].isVisited = true;
      //parentNode[row - 1][col] = currentNode;
    }
    if (row < grid.length - 1 && !grid[row + 1][col].isVisited) {
      q.push(grid[row + 1][col]);
      visitedNodesInOrder.push(grid[row + 1][col]);
      grid[row + 1][col].isVisited = true;
      //parentNode[row + 1][col] = currentNode;
    }
    if (col > 0 && !grid[row][col - 1].isVisited) {
      q.push(grid[row][col - 1]);
      visitedNodesInOrder.push(grid[row][col - 1]);
      grid[row][col - 1].isVisited = true;
      //parentNode[row][col - 1] = currentNode;
    }
    if (col < grid[0].length - 1 && !grid[row][col + 1].isVisited) {
      q.push(grid[row][col + 1]);
      visitedNodesInOrder.push(grid[row][col + 1]);
      grid[row][col + 1].isVisited = true;
      // parentNode[row][col + 1] = currentNode;
    }
  }
  return -1;
}

export function nodesInShortestPath(visitedNodeInOrder, finishNode) {
  let shortestPathNodes = [finishNode];
}
