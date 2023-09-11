/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { MainData } from 'typings/MainData';

const N: number = 9;

// crate table with 9x9 cells, each cell has value 0 and isFilledCell is true
const table: MainData[][] = Array.from({ length: N }, () =>
  Array.from({ length: N }, () => ({ value: 0, isFilledCell: true }))
);

const SRNd = Math.sqrt(N);
const SRN = Math.floor(SRNd);

function randomGenerator(num: number) {
  // eslint-disable-next-line no-bitwise
  return ~~(Math.random() * num + 1);
}

// check in the row for existence
function unUsedInRow(i: number, num: number) {
  for (let j = 0; j < N; j++) {
    if (table[i][j].value === num) {
      return false;
    }
  }
  return true;
}

// check in the col for existence
function unUsedInCol(j: number, num: number) {
  for (let i = 0; i < N; i++) {
    if (table[i][j].value === num) {
      return false;
    }
  }
  return true;
}

// Returns false if given 3 x 3 block contains num.
function unUsedInBox(rowStart: number, colStart: number, num: number) {
  for (let i = 0; i < SRN; i++) {
    for (let j = 0; j < SRN; j++) {
      if (table[rowStart + i][colStart + j].value === num) {
        return false;
      }
    }
  }
  return true;
}

// Check if safe to put in cell
function checkIfSafe(i: number, j: number, num: number) {
  return (
    unUsedInRow(i, num) &&
    unUsedInCol(j, num) &&
    unUsedInBox(i - (i % SRN), j - (j % SRN), num)
  );
}

// Fill a 3 x 3 matrix.
function fillBox(row: number, col: number) {
  let num = 0;
  for (let i = 0; i < SRN; i++) {
    for (let j = 0; j < SRN; j++) {
      while (!unUsedInBox(row, col, num)) {
        num = randomGenerator(N);
      }
      table[row + i][col + j] = { value: num, isFilledCell: true };
    }
  }
}

function fillDiagonal() {
  for (let i = 0; i < N; i += SRN) {
    // for diagonal box, start coordinates->i==j
    fillBox(i, i);
  }
}

// A recursive function to fill remaining
// matrix
function fillRemaining(i: number, j: number) {
  // Check if we have reached the end of the matrix
  if (i === N - 1 && j === N) return true;

  // Move to the next row if we have reached the end of the current row
  if (j === N) {
    i += 1;
    j = 0;
  }

  // Skip cells that are already filled
  if (table[i][j].value !== 0) {
    return fillRemaining(i, j + 1);
  }

  // Try filling the current cell with a valid value
  for (let num = 1; num <= N; num++) {
    if (checkIfSafe(i, j, num)) {
      table[i][j].value = num;
      if (fillRemaining(i, j + 1)) {
        return true;
      }
      table[i][j].value = 0;
    }
  }
  // No valid value was found, so backtrack
  return false;
}

// Print sudoku
export function printSudoku() {
  let str: string = '';
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      // eslint-disable-next-line prefer-template
      str += table[i][j].value.toString() + ' ';
    }
    console.log(str);
    str = '';
  }
}
const K = 20;
// Remove the K no. of digits to
// complete game
export function removeKDigits() {
  let count = K;

  while (count !== 0) {
    // extract coordinates i and j
    let i = Math.floor(Math.random() * N);
    let j = Math.floor(Math.random() * N);
    if (table[i][j].value !== 0) {
      count--;
      table[i][j].value = 0;
      table[i][j].isFilledCell = false;
    }
  }

  // eslint-disable-next-line no-useless-return
  return;
}

export function fillValues() {
  // Fill the diagonal of SRN x SRN matrices
  fillDiagonal();
  // Fill remaining blocks
  fillRemaining(0, SRN);
}

export default table;
