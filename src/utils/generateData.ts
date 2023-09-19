import { MainData, SolveSudoku, TableType } from 'typings/MainData';
/* eslint-disable no-param-reassign, no-plusplus */

function randomGenerator(num: number) {
  // eslint-disable-next-line no-bitwise
  return ~~(Math.random() * num + 1);
}

class SudokuTable implements TableType {
  matrix: MainData[][];

  numberOfRow: number;

  SRN: number;

  constructor(numberOfRow: number = 9, matrix: MainData[][] | null = null) {
    this.numberOfRow = numberOfRow;

    const SRNd = Math.sqrt(numberOfRow);
    this.SRN = Math.floor(SRNd);

    if (!matrix || matrix.length === 0) {
      this.matrix = Array.from({ length: numberOfRow }, () =>
        Array.from({ length: numberOfRow }, () => ({
          value: 0,
          isFilledCell: true,
          isActive: false,
        }))
      );
    } else this.matrix = matrix;
  }

  emptyMatrix(): void {
    this.matrix = Array.from({ length: this.numberOfRow }, () =>
      Array.from({ length: this.numberOfRow }, () => ({
        value: 0,
        isFilledCell: true,
        isActive: false,
      }))
    );
  }

  /**
   * Edit matrix after checking if safe
   * @param i
   * @param j
   * @param value
   * @returns -1 if edited, [i, j] if not safe
   */
  editMatrix(i: number, j: number, value: number): number | number[] {
    const checker = this.checkIfSafe(i, j, value);
    console.log(checker);
    // checher === -1 => valid
    if (checker === -1) {
      this.matrix[i][j].value = value;
      return -1;
    }
    return checker;
  }

  // check in the row for existence
  unUsedInRow(i: number, num: number): number | number[] {
    for (let j = 0; j < this.numberOfRow; j++)
      if (this.matrix[i][j].value === num) return [i, j];
    return -1;
  }

  // check in the col for existence
  unUsedInCol(j: number, num: number): number | number[] {
    for (let i = 0; i < this.numberOfRow; i++)
      if (this.matrix[i][j].value === num) return [i, j];
    return -1;
  }

  // Returns false if given 3 x 3 block contains num.
  unUsedInBox(
    rowStart: number,
    colStart: number,
    num: number
  ): number | number[] {
    for (let i = 0; i < this.SRN; i++)
      for (let j = 0; j < this.SRN; j++)
        if (this.matrix[rowStart + i][colStart + j].value === num)
          return [i, j];
    return -1;
  }

  /**
   * Check if safe to put in cell
   * @param i
   * @param j
   * @param num
   * @returns -1 if safe, [i, j] if not safe
   */
  checkIfSafe(i: number, j: number, num: number): number | number[] {
    if (this.unUsedInRow(i, num) !== -1) return this.unUsedInRow(i, num);
    if (this.unUsedInCol(j, num) !== -1) return this.unUsedInCol(j, num);
    if (this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num) !== -1)
      return this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num);

    return -1;
  }

  // Fill a 3 x 3 matrix.
  fillBox(row: number, col: number): void {
    let num = 0;
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        while (this.unUsedInBox(row, col, num) !== -1) {
          num = randomGenerator(this.numberOfRow);
        }
        this.matrix[row + i][col + j] = {
          value: num,
          isFilledCell: true,
          isActive: false,
        };
      }
    }
  }

  // Fill Diagonal
  fillDiagonal(): void {
    for (let i = 0; i < this.numberOfRow; i += this.SRN)
      // for diagonal box, start coordinates->i==j
      this.fillBox(i, i);
  }

  // A recursive function to fill remaining matrix
  fillRemaining(i: number, j: number): boolean {
    // Check if we have reached the end of the matrix
    if (i === this.numberOfRow - 1 && j === this.numberOfRow) return true;
    // Move to the next row if we have reached the end of the current row
    if (j === this.numberOfRow) {
      i += 1;
      j = 0;
    }
    // Skip cells that are already filled
    if (this.matrix[i][j].value !== 0) {
      return this.fillRemaining(i, j + 1);
    }
    // Try filling the current cell with a valid value
    for (let num = 1; num <= this.numberOfRow; num++) {
      if (this.checkIfSafe(i, j, num) === -1) {
        this.matrix[i][j].value = num;
        if (this.fillRemaining(i, j + 1)) {
          return true;
        }
        this.matrix[i][j].value = 0;
      }
    }
    // No valid value was found, so backtrack
    return false;
  }

  fillValues(): void {
    this.emptyMatrix();
    // Fill the diagonal of SRN x SRN matrices
    this.fillDiagonal();
    // Fill remaining blocks
    this.fillRemaining(0, this.SRN);
  }

  removeKDigits(k: number = 20): MainData[][] {
    let newMatrix: MainData[][] = [];
    newMatrix = this.matrix.map((row) => row.map((cell) => ({ ...cell })));
    let count = k;
    while (count !== 0) {
      // extract coordinates i and j
      const i = Math.floor(Math.random() * this.numberOfRow);
      const j = Math.floor(Math.random() * this.numberOfRow);
      if (newMatrix[i][j].value !== 0) {
        count--;
        newMatrix[i][j].value = 0;
        newMatrix[i][j].isFilledCell = false;
      }
    }
    return newMatrix;
  }

  solveSudoku(): SolveSudoku {
    const n = this.matrix[0].length;
    let newGird: MainData[][] = [];
    newGird = this.matrix.concat();
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (newGird[row][col].value === 0) {
          // Empty cell, try filling it with numbers 1 to n
          for (let num = 1; num <= n; num++) {
            if (this.checkIfSafe(row, col, num) === -1) {
              // Place the number in the empty cell
              newGird[row][col].value = num;
              // Recursively solve the rest of the newGird
              if (this.solveSudoku().solved) {
                return { grid: newGird, solved: true };
              }
              // Failed to find a solution, backtrack and try a different number
              newGird[row][col].value = 0;
            }
          }
          // Unable to solve the Sudoku puzzle
          return { grid: newGird, solved: false };
        }
      }
    }
    // Sudoku puzzle solved (no empty cells remaining)
    return { grid: newGird, solved: true };
  }
}

export default SudokuTable;

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
  console.log('-----------------');
}
