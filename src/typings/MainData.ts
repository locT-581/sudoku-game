export interface MainData {
  value: number;
  isFilledCell: boolean;
  note: number[];
}
export interface SolveSudoku {
  grid: MainData[][];
  solved: boolean;
}
export interface TableType {
  matrix: MainData[][];
  numberOfRow: number;
  SRN: number;
  emptyMatrix(): void;
  checkIfSafe(i: number, j: number, num: number): number | number[];
  fillValues(): void;
  editMatrix(
    i: number,
    j: number,
    value: number,
    isFilledCell?: boolean
  ): number | number[];
  removeKDigits(k: number): MainData[][];
}

export interface InitState {
  data: { matrix: MainData[][]; timer: number };
  isCounting: boolean;
  error?: string;
}
