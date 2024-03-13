/* eslint-disable no-plusplus */
import { MainData } from 'typings/MainData';

/**
 * Check if valid data and return a matrix
 * @param data expect a string with format 9x9
 * @returns MainData[][] or false
 */
export default function checkStringDataAndConvertToMainData(
  data: any,
): boolean | MainData[][] {
  if (typeof data !== 'string') {
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
      note: [],
    })),
  );

  for (let i = 0; i < m; i++) {
    if (matrix[i].length !== n) {
      return false;
    }
    for (let j = 0; j < n; j++) {
      if (/^[0-9]$/.test(matrix[i][j])) {
        table[i][j] = {
          value: Number(matrix[i][j]),
          isFilledCell: Number(matrix[i][j]) !== 0,
          note: [],
        };
      } else return false;
    }
  }
  return table;
}

/**
 * Check valid MainData matrix
 * @param data expect a matrix 9x9
 * @returns true or false
 */
export function checkMainDataType(data: MainData[][]): boolean | MainData[][] {
  if (!Array.isArray(data)) {
    return false;
  }
  const m = 9;
  for (let i = 0; i < m; i++) {
    // check if matrix is square 9x9
    if (data[i].length !== m) {
      console.log('matrix is not square');
      return false;
    }
    // Check if value is number and isFilledCell is boolean
    for (let j = 0; j < m; j++) {
      if (typeof data[i][j].value !== 'number') {
        return false;
      }
      if (typeof data[i][j].isFilledCell !== 'boolean') {
        return false;
      }
    }
  }
  return true;
}
