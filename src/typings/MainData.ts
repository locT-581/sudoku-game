export interface MainData {
  value: number;
  isActive: boolean;
  isFilledCell: boolean;
  note?: number[];
}
export interface SolveSudoku {
  grid: MainData[][];
  solved: boolean;
}
export interface TableType {
  matrix: MainData[][];
  numberOfRow: number;
  SRN: number;

  checkIfSafe(i: number, j: number, num: number): number | number[];
  fillValues(): void;
  editMatrix(i: number, j: number, value: number): number | number[];
  removeKDigits(k: number): MainData[][];
}

export interface InitState {
  data: TableType;
  isCounting: boolean;
  error?: string;
}
