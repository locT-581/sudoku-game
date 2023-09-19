/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-template */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
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
import { useParams } from 'react-router-dom';

function Game() {
  const { level } = useParams();

  const rawSudoku = useRef<TableType>(new SudokuTable(9, []));
  const sudokuRemoved = useRef<TableType>(new SudokuTable(9, []));
  const sudokuUserPlay = useRef<TableType>(new SudokuTable(9, []));
  const [tableSudoku, setTableSudoku] = useState<MainData[][]>([]);

  useEffect(() => {
    // Fill raw sudoku
    rawSudoku.current.fillValues();
    // Copy raw sudoku to sudokuRemoved and sudokuUserPlay
    sudokuRemoved.current.matrix = rawSudoku.current.removeKDigits(
      Difficulty[level as keyof typeof Difficulty]
    );
    sudokuUserPlay.current.matrix = sudokuRemoved.current.matrix;
    setTableSudoku(sudokuUserPlay.current.matrix);
  }, []);

  useEffect(() => {
    console.log('bb');
    printSudoku(sudokuUserPlay.current.matrix);
    const { grid, solved } = sudokuUserPlay.current.solveSudoku();
    printSudoku(sudokuUserPlay.current.matrix);
    if (!solved) {
      console.log('Wrong solution');
      return;
    }
  }, [tableSudoku]);

  const handleRestart = () => {};

  const handleSolve = () => {};

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, id } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [tag, row, col] = id.split('-');
    const edit = sudokuUserPlay.current.editMatrix(
      Number(row),
      Number(col),
      Number(value)
    );
    if (edit === -1) {
      setTableSudoku(sudokuUserPlay.current.matrix);
    } else {
      document.getElementById(`${edit[0]}-${edit[1]}`).style.backgroundColor =
        'red';
    }
  };
  return (
    <div className="warper">
      <TableContainer sx={{ width: '500px', height: '500px' }}>
        <Table>
          <TableBody>
            {tableSudoku.map((row, i) => (
              <TableRow key={`key-${i + 1}`}>
                {row.map((cell, j) => (
                  <TableCell
                    className="cell"
                    sx={{
                      backgroundColor: cell.isFilledCell
                        ? '#937d60a3'
                        : 'transparent',
                      border: '1px solid white',
                      textAlign: 'center',
                      cursor: !cell.isFilledCell ? 'pointer' : 'default',
                      ...(!cell.isFilledCell ? { padding: '0px' } : null),
                    }}
                    {...(!cell.isFilledCell && {
                      onClick: () => {},
                    })}
                    id={`${i}-${j}`}
                    key={`key-${i}-${j}`}
                  >
                    {cell.isFilledCell ? (
                      cell.value
                    ) : (
                      <input
                        id={`input-${i}-${j}`}
                        className="input-cell"
                        type="number"
                        onChange={handleOnChange}
                      />
                    )}
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
