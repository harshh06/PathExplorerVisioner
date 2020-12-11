export function dijkstra(grid, startNode, finishNode) {
  const visitedcellsInOrder = [];
  startNode.distance = 0;
  const unvisitedcells = getAllcells(grid); // Q: different from using grid or slice of grid???

  while (unvisitedcells.length) {
    sortcellsByDistance(unvisitedcells);
    const closestNode = unvisitedcells.shift();
    // If we encounter a wall, we skip it.
    if (!closestNode.isWall) {
      // If the closest node is at a distance of infinity,
      // we must be trapped and should stop.
      if (closestNode.distance === Infinity) return visitedcellsInOrder;
      closestNode.isVisited = true;
      visitedcellsInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedcellsInOrder;
      updateUnvisitedNeighbors(closestNode, grid);
    }
  }
}

function getAllcells(grid) {
  const cells = [];
  for (const row of grid) {
    for (const node of row) {
      cells.push(node);
    }
  }
  return cells;
}

function sortcellsByDistance(unvisitedcells) {
  unvisitedcells.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.parentNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}
