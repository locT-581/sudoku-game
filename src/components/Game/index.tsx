import { useEffect, useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import Button from 'UI/Button';
import { MainData, TableType } from 'typings/MainData';
import SudokuTable, { printSudoku } from 'utils/generateData';
import { Difficulty } from 'enum';
// import { useAppSelector } from 'redux/hook';

function Game() {
  const sudoku = useRef<TableType>(new SudokuTable(9));
  const [sudokuTable, setSudokuTable] = useState<MainData[][]>([]);

  useEffect(() => {
    sudoku.current.fillValues();
    setSudokuTable([...sudoku.current.removeKDigits(Difficulty.EASY)]);
    sudoku.current.removeKDigits(Difficulty.EASY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestart = () => {
    sudoku.current.fillValues();
    setSudokuTable(sudoku.current.removeKDigits(Difficulty.EASY));
  };

  const handleSolve = () => {
    printSudoku(sudoku.current.solveSudoku().grid);
    printSudoku(sudoku.current.matrix);
  };

  return (
    <div className="warper">
      <h1>1233</h1>
      <TableContainer sx={{ width: '500px', height: '500px' }}>
        <Table>
          <TableBody>
            {sudokuTable.map((row, i) => (
              <TableRow key={`key-${i + 6}`}>
                {row.map((cell, j) => (
                  <TableCell
                    sx={{
                      border: '1px solid white',
                      textAlign: 'center',
                      cursor: !cell.isFilledCell ? 'pointer' : 'default',
                    }}
                    key={`key-${j + 2}`}
                  >
                    {cell.isFilledCell && cell.value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleRestart}>
        <p>Restart</p>
      </Button>
      <Button onClick={handleSolve}>
        <p>Solve</p>
      </Button>
    </div>
  );
}

export default Game;
