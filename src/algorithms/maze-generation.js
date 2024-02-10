export class MazeGenerator {
    constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.maze = this.initializeMaze();
    }
  
    initializeMaze() {
      const maze = [];
      for (let i = 0; i < this.rows; i++) {
        maze[i] = [];
        for (let j = 0; j < this.cols; j++) {
          maze[i][j] = 0;
        }
      }
      return maze;
    }
  
    generateMaze(startRow, startCol, endRow, endCol) {
      this.carvePath(startRow, startCol, endRow, endCol);
      return this.maze;
    }
  
    carvePath(row, col, endRow, endCol) {
      const directions = [
        { row: -2, col: 0 },
        { row: 0, col: 2 },
        { row: 2, col: 0 },
        { row: 0, col: -2 }
      ];
  
    //   this.maze[row][col] = 1;
  
      const shuffledDirections = directions.sort(() => Math.random() - 0.5);
  
      for (const direction of shuffledDirections) {
        const newRow = row + direction.row;
        const newCol = col + direction.col;
  
        if (
          newRow >= 0 && newRow < this.rows &&
          newCol >= 0 && newCol < this.cols &&
          this.maze[newRow][newCol] === 0
        ) {
          this.maze[newRow][newCol] = 1;
          this.maze[row + direction.row / 2][col + direction.col / 2] = 1;
  
          if (newRow === endRow && newCol === endCol) {
            // Stop carving when reaching the end node
            return;
          }
  
          this.carvePath(newRow, newCol, endRow, endCol);
        }
      }
    }
  }
  
  