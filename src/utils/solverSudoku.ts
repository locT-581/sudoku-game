/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { MainData, SolveSudoku } from 'typings/MainData';

// check in the row for existence
function unUsedInRow(
  matrix: MainData[][],
  i: number,
  num: number
): number | number[] {
  const numberOfRow = matrix[0].length;
  for (let j = 0; j < numberOfRow; j++)
    if (matrix[i][j].value === num) return [i, j];
  return -1;
}

// check in the col for existence
function unUsedInCol(
  matrix: MainData[][],
  j: number,
  num: number
): number | number[] {
  const numberOfRow = matrix[0].length;
  for (let i = 0; i < numberOfRow; i++)
    if (matrix[i][j].value === num) return [i, j];
  return -1;
}

// Returns false if given 3 x 3 block contains num.
function unUsedInBox(
  matrix: MainData[][],
  rowStart: number,
  colStart: number,
  num: number,
  SRN: number
): number | number[] {
  for (let i = 0; i < SRN; i++)
    for (let j = 0; j < SRN; j++)
      if (matrix[rowStart + i][colStart + j].value === num) return [i, j];
  return -1;
}

function checkIfSafe(
  matrix: MainData[][],
  i: number,
  j: number,
  num: number
): number | number[] {
  const SRN = Math.floor(Math.sqrt(matrix[0].length));
  const rowChecker = unUsedInRow(matrix, i, num);
  const colChecker = unUsedInCol(matrix, i, num);
  const boxChecker = unUsedInBox(
    matrix,
    i - (i % SRN),
    j - (j % SRN),
    num,
    SRN
  );
  if (rowChecker !== -1) {
    return rowChecker;
  }
  if (colChecker !== -1) {
    return colChecker;
  }
  if (boxChecker !== -1) {
    return boxChecker;
  }
  return -1;
}

export default function solveSudoku1(matrix: MainData[][]): SolveSudoku {
  const n = matrix[0].length;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (matrix[row][col].value === 0) {
        // Empty cell, try filling it with numbers 1 to n
        for (let num = 1; num <= n; num++) {
          if (checkIfSafe(matrix, row, col, num) === -1) {
            // Place the number in the empty cell
            matrix[row][col].value = num;
            // Recursively solve the rest of the matrix
            if (solveSudoku1(matrix)) {
              return { grid: matrix, solved: true };
            }
            // Failed to find a solution, backtrack and try a different number
            matrix[row][col].value = 0;
          }
        }
        // Unable to solve the Sudoku puzzle
        return { grid: matrix, solved: false };
      }
    }
  }
  // Sudoku puzzle solved (no empty cells remaining)
  return { grid: matrix, solved: true };
}

export function solveSudoku(grid: MainData[][], row: number, col: number) {
  const N = grid[0].length;
  // Stop
  if (row === N - 1 && col === N) return true;
  // Check if column value  becomes 9, we move to next row and column start from 0
  if (col === N) {
    row++;
    col = 0;
  }
  /* Check if the current position of the grid already
    contains value > 0, we iterate for next column */
  if (grid[row][col].value !== 0) return solveSudoku(grid, row, col + 1);
  for (let num = 0; num < 9; num++) {
    /* Check if it is safe to place the num (1-9)
     in the given row, col ->we move to next column */
    if (checkIfSafe(grid, row, col, num)) {
      /* assigning the num in the current (row,col) position of the grid and
         assuming our assigned num in the position is correct */
      grid[row][col].value = num;
      // Checking for next possibility with next column
      if (solveSudoku(grid, row, col + 1)) return true;
    }
    /* removing the assigned num, since our assumption was wrong,
      and we go for next assumption with diff num value   */
    grid[row][col].value = 0;
  }
  return false;
}
