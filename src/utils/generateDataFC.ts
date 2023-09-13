/* eslint-disable prefer-const, no-param-reassign, no-plusplus */
import { MainData, TableType } from 'typings/MainData';

function randomGenerator(num: number) {
  // eslint-disable-next-line no-bitwise
  return ~~(Math.random() * num + 1);
}

// Print sudoku
export function printSudoku(table: MainData[][]) {
  // Number of elements in each row
  const N: number = table[0] ? table[0].length : 0;
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

/**
 * Generate full sudoku table
 * @param N number of rows and columns
 * @returns a full sudoku table
 */
export default function generateData(N: number = 9): TableType {
  // Create table with 9x9 cells, each cell has value 0 and isFilledCell is true
  const table: MainData[][] = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => ({ value: 0, isFilledCell: true }))
  );
  // Calculate diagonal matrices
  const SRNd = Math.sqrt(N);
  const SRN = Math.floor(SRNd);

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
  // Fill Diagonal
  function fillDiagonal() {
    for (let i = 0; i < N; i += SRN) {
      // for diagonal box, start coordinates->i==j
      fillBox(i, i);
    }
  }
  // A recursive function to fill remaining matrix
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

  function fillValues() {
    // Fill the diagonal of SRN x SRN matrices
    fillDiagonal();
    // Fill remaining blocks
    fillRemaining(0, SRN);
    return table;
  }
  return fillValues(); // Return the table with full values
}

/**
 * Remove the K no. of digits to complete game
 * @param table a full sudoku table
 * @param N number of rows and columns
 * @param K number of cells to be removed
 * @returns a table with K no. of digits removed
 */
export function removeKDigits(
  table: MainData[][],
  N: number = 9,
  K: number = 20
): TableType {
  const newTable = table.concat();
  let count = K;
  while (count !== 0) {
    // Extract coordinates i and j
    let i = Math.floor(Math.random() * N);
    let j = Math.floor(Math.random() * N);
    if (newTable[i][j].value !== 0) {
      count--;
      newTable[i][j].value = 0;
      newTable[i][j].isFilledCell = false;
    }
  }
  return newTable;
}
