export interface MainData {
  value: number;
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

  fillValues(): void;
  removeKDigits(k: number): MainData[][];
  solveSudoku(): SolveSudoku;
}

export interface InitState {
  data: TableType;
  isCounting: boolean;
  error?: string;
}
