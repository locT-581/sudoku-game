export interface MainData {
  value: number;
  isFilledCell: boolean;
  note?: number[];
}

export interface TableType {
  matrix: MainData[][];
  numberOfRow: number;
  SRN: number;

  fillValues(): void;
  removeKDigits(k: number): MainData[][];
}

export interface InitState {
  data: TableType;
  isCounting: boolean;
  error?: string;
}
