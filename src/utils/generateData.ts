import { MainData, TableType } from 'typings/MainData';
/* eslint-disable no-param-reassign, no-plusplus */

function randomGenerator(num: number) {
  // eslint-disable-next-line no-bitwise
  return ~~(Math.random() * num + 1);
}

class SudokuTable implements TableType {
  matrix: MainData[][];

  numberOfRow: number;

  SRN: number;

  constructor(numberOfRow: number = 9) {
    this.numberOfRow = numberOfRow;

    const SRNd = Math.sqrt(numberOfRow);
    this.SRN = Math.floor(SRNd);

    this.matrix = Array.from({ length: numberOfRow }, () =>
      Array.from({ length: numberOfRow }, () => ({
        value: 0,
        isFilledCell: true,
      }))
    );
  }

  emptyMatrix(): void {
    this.matrix = Array.from({ length: this.numberOfRow }, () =>
      Array.from({ length: this.numberOfRow }, () => ({
        value: 0,
        isFilledCell: true,
      }))
    );
  }

  // check in the row for existence
  unUsedInRow(i: number, num: number): boolean {
    for (let j = 0; j < this.numberOfRow; j++) {
      if (this.matrix[i][j].value === num) {
        return false;
      }
    }
    return true;
  }

  // check in the col for existence
  unUsedInCol(j: number, num: number): boolean {
    for (let i = 0; i < this.numberOfRow; i++) {
      if (this.matrix[i][j].value === num) {
        return false;
      }
    }
    return true;
  }

  // Returns false if given 3 x 3 block contains num.
  unUsedInBox(rowStart: number, colStart: number, num: number): boolean {
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        if (this.matrix[rowStart + i][colStart + j].value === num) {
          return false;
        }
      }
    }
    return true;
  }

  // Check if safe to put in cell
  checkIfSafe(i: number, j: number, num: number): boolean {
    return (
      this.unUsedInRow(i, num) &&
      this.unUsedInCol(j, num) &&
      this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
    );
  }

  // Fill a 3 x 3 matrix.
  fillBox(row: number, col: number): void {
    let num = 0;
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        while (!this.unUsedInBox(row, col, num)) {
          num = randomGenerator(this.numberOfRow);
        }
        this.matrix[row + i][col + j] = { value: num, isFilledCell: true };
      }
    }
  }

  // Fill Diagonal
  fillDiagonal(): void {
    for (let i = 0; i < this.numberOfRow; i += this.SRN) {
      // for diagonal box, start coordinates->i==j
      this.fillBox(i, i);
    }
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
      if (this.checkIfSafe(i, j, num)) {
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
}

export default SudokuTable;
