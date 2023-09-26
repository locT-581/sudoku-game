/* eslint-disable no-plusplus */
import { MainData } from 'typings/MainData';

export function checkData(data: any): boolean | MainData[][] {
  if (typeof data !== 'string') {
    console.log('data is not string');
    return false;
  }
  const lines = data.split('\n');
  const matrix = lines.map((line) => {
    const newLine = line.replace(/\r/g, '');
    return newLine.split(' ').filter(Boolean);
  });
  const m = matrix.length;
  const n = matrix[0].length;

  let table: MainData[][] = [];
  table = Array.from({ length: m }, () =>
    Array.from({ length: m }, () => ({
      value: 0,
      isFilledCell: false,
    }))
  );

  for (let i = 0; i < m; i++) {
    if (matrix[i].length !== n) {
      console.log('matrix is not square');
      return false;
    }
    for (let j = 0; j < n; j++) {
      if (/^[0-9]$/.test(matrix[i][j])) {
        table[i][j] = {
          value: Number(matrix[i][j]),
          isFilledCell: Number(matrix[i][j]) !== 0,
        };
      } else return false;
    }
  }
  return table;
}
