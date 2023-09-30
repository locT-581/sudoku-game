/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-template */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Button from 'UI/Button';
import { MainData, TableType } from 'typings/MainData';
import SudokuTable, { printSudoku } from 'utils/generateData';
import { Difficulty } from 'enum';
import { Link, useParams } from 'react-router-dom';
import solveSudoku from 'utils/solverSudoku';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { RootState } from 'redux/store';
import CustomTable from 'UI/CustomTable';
import { updateData } from 'redux/reducers/gameSlice';

interface CoordinatesWrongCell {
  row: number;
  col: number;
  coordinatesInput: number[];
}

function Game() {
  const dispatch = useAppDispatch();
  const { matrix } = useAppSelector((state: RootState) => state.gameSlice);
  const { level } = useParams();

  const rawSudoku = useRef<TableType>(new SudokuTable(9, matrix));
  const sudokuRemoved = useRef<TableType>(new SudokuTable(9, []));
  const sudokuUserPlay = useRef<TableType>(new SudokuTable(9, []));
  const [tableSudoku, setTableSudoku] = useState<MainData[][]>([]);
  const [wrongCell, setWrongCell] = useState<CoordinatesWrongCell[]>([]);

  useEffect(() => {
    // Set data in localStorage = ''
    localStorage.setItem('data', '');
    if (matrix.length > 0 && level === 'NONE') {
      // Copy raw sudoku to sudokuRemoved
      for (let i = 0; i < 9; i++) {
        sudokuRemoved.current.matrix[i] = [];
        for (let j = 0; j < 9; j++) {
          sudokuRemoved.current.matrix[i][j] = {
            value: rawSudoku.current.matrix[i][j].value,
            isFilledCell: rawSudoku.current.matrix[i][j].isFilledCell,
          };
        }
      }
    } else {
      // Fill raw sudoku
      rawSudoku.current.fillValues();
      // Copy raw sudoku to sudokuRemoved and sudokuUserPlay
      sudokuRemoved.current.matrix = rawSudoku.current.removeKDigits(
        Difficulty[level as keyof typeof Difficulty]
      );
    }
    for (let i = 0; i < 9; i++) {
      sudokuUserPlay.current.matrix[i] = [];
      for (let j = 0; j < 9; j++) {
        sudokuUserPlay.current.matrix[i][j] = {
          value: sudokuRemoved.current.matrix[i][j].value,
          isFilledCell: sudokuRemoved.current.matrix[i][j].isFilledCell,
        };
      }
    }
    setTableSudoku(sudokuUserPlay.current.matrix);
  }, []);

  useEffect(() => {
    // Loop through wrongCell array and add class wrong-cell for every cell
    wrongCell.forEach((cell) => {
      const cellElement: HTMLElement | null = document.getElementById(
        `${cell.row}-${cell.col}`
      );
      if (cellElement) {
        cellElement.classList.add('wrong-cell');
      }
    });
  }, [wrongCell]);

  useEffect(() => {
    // printSudoku(tableSudoku, '84/Game');
    // Copy a newTableSudoku from tableSudoku
    const newTableSudoku: MainData[][] = [];
    if (tableSudoku.length === 0) return;
    for (let i = 0; i < 9; i++) {
      newTableSudoku[i] = [];
      for (let j = 0; j < 9; j++) {
        newTableSudoku[i][j] = {
          value: tableSudoku[i][j].value,
          isFilledCell: tableSudoku[i][j].isFilledCell,
        };
      }
    }
    // Update sudokuUserPlay.current.matrix to localStorage
    localStorage.setItem('data', JSON.stringify(newTableSudoku));
    // Update data in redux
    dispatch(updateData(newTableSudoku));
  }, [tableSudoku]);
  const handleRestart = () => {
    // Reset wrongCell
    setWrongCell([]);
    // Reset input value
    const inputCells: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('.input-cell');
    inputCells.forEach((input) => {
      input.value = '';
      input.removeAttribute('disabled');
    });
    // Reset class wrong-cell
    const wrongCells: NodeListOf<HTMLElement> =
      document.querySelectorAll('.wrong-cell');
    wrongCells.forEach((cell) => {
      cell.classList.remove('wrong-cell');
    });
    // Fill new raw sudoku
    rawSudoku.current.fillValues();
    // Copy raw sudoku to sudokuRemoved and sudokuUserPlay
    sudokuRemoved.current.matrix = rawSudoku.current.removeKDigits(
      Difficulty[level as keyof typeof Difficulty]
    );
    for (let i = 0; i < 9; i++) {
      sudokuUserPlay.current.matrix[i] = [];
      for (let j = 0; j < 9; j++) {
        sudokuUserPlay.current.matrix[i][j] = {
          value: sudokuRemoved.current.matrix[i][j].value,
          isFilledCell: sudokuRemoved.current.matrix[i][j].isFilledCell,
        };
      }
    }
    setTableSudoku([...sudokuUserPlay.current.matrix]);
  };

  const handleSolve = () => {
    let tableSudokuTemp: MainData[][] = [];
    // Copy sudokuUserPlay.current.matrix to tableSudokuTemp
    for (let i = 0; i < 9; i++) {
      tableSudokuTemp[i] = [];
      for (let j = 0; j < 9; j++) {
        tableSudokuTemp[i][j] = {
          value: sudokuRemoved.current.matrix[i][j].value,
          isFilledCell: sudokuRemoved.current.matrix[i][j].isFilledCell,
        };
      }
    }
    solveSudoku(tableSudokuTemp, 0, 0);
    printSudoku(tableSudokuTemp);
    tableSudokuTemp = [];
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id } = e.target;
    // ?? -> assign default value if e.nativeEvent.data is null or undefined
    const [tag, row, col] = id.split('-');
    if (tag !== 'input') return;
    e.target.value = (e.nativeEvent as InputEvent).data ?? '';
    if (wrongCell.length > 0) {
      const cellRemove = wrongCell.filter((cell) => {
        return (
          JSON.stringify(cell.coordinatesInput) ===
          JSON.stringify([Number(row), Number(col)])
        );
      });
      if (cellRemove.length > 0) {
        // Remove cellRemove element in array wrongCell
        const newWrongCell = wrongCell.filter((c) => {
          return (
            JSON.stringify(c.coordinatesInput) !==
            JSON.stringify([Number(row), Number(col)])
          );
        });
        // Remove class wrong-cell for row, col cell
        const cell: HTMLElement | null = document.getElementById(
          `${cellRemove[0].row}-${cellRemove[0].col}`
        );
        if (cell) {
          cell.classList.remove('wrong-cell');
        }
        setWrongCell(newWrongCell);
      }
      if (!(e.nativeEvent as InputEvent).data) {
        sudokuUserPlay.current.editMatrix(Number(row), Number(col), 0, false);
        // Edit useState to rerender in react
        setTableSudoku([...sudokuUserPlay.current.matrix]);
        return;
      }
    }
    // Check valid input, compare with row and col
    const checker: number | number[] = sudokuUserPlay.current.checkIfSafe(
      Number(row),
      Number(col),
      Number(e.target.value)
    );
    if (checker === -1) {
      // Is it possible to continue solving?
      let tableSudokuTemp: MainData[][] = [];
      // Copy sudokuUserPlay.current.matrix to tableSudokuTemp
      for (let i = 0; i < 9; i++) {
        tableSudokuTemp[i] = [];
        for (let j = 0; j < 9; j++) {
          tableSudokuTemp[i][j] = {
            value: sudokuUserPlay.current.matrix[i][j].value,
            isFilledCell: sudokuUserPlay.current.matrix[i][j].isFilledCell,
          };
        }
      }
      // Edit tableSudokuTemp to try solve, if ok then edit sudokuUserPlay.current.matrix
      tableSudokuTemp[Number(row)][Number(col)].value = Number(e.target.value);
      // Try to solve with tableSudokuTemp
      const solved: boolean = solveSudoku(tableSudokuTemp, 0, 0);
      if (!solved) {
        console.log(
          'There is no further solution if you enter this number here!'
        );
        setWrongCell([
          ...wrongCell.filter((c) => {
            return (
              JSON.stringify(c.coordinatesInput) !==
              JSON.stringify([Number(row), Number(col)])
            );
          }),
          {
            row: Number(row),
            col: Number(col),
            coordinatesInput: [],
          },
        ]);
        e.target.classList.add('wrong-cell');
      } else if (solved) {
        // Edit valid matrix after check
        sudokuUserPlay.current.editMatrix(
          Number(row),
          Number(col),
          Number(e.target.value),
          false
        );
        e.target.classList.remove('wrong-cell');
        e.target.setAttribute('disabled', 'true');
        // Edit useState to rerender in react
        setTableSudoku([...sudokuUserPlay.current.matrix]);
        // Reset tableSudokuTemp
        tableSudokuTemp = [];
      }
    } else if (typeof checker !== 'number') {
      setWrongCell([
        ...wrongCell.filter((c) => {
          return (
            JSON.stringify(c.coordinatesInput) !==
            JSON.stringify([Number(row), Number(col)])
          );
        }),
        {
          row: checker[0],
          col: checker[1],
          coordinatesInput: [Number(row), Number(col)],
        },
      ]);
      const cell: HTMLElement | null = document.getElementById(
        `${checker[0]}-${checker[1]}`
      );
      if (cell) {
        cell.classList.add('wrong-cell');
      }
    }
  };

  return (
    <div className="warper">
      <CustomTable>
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
                      cursor: !cell.isFilledCell ? 'pointer' : 'default',
                      ...(!cell.isFilledCell ? { padding: '0px' } : null),
                    }}
                    id={`${i}-${j}`}
                    key={`key-${i}-${j}`}
                  >
                    {cell.isFilledCell ? (
                      cell.value
                    ) : matrix.length > 0 &&
                      matrix[i][j].value !== 0 &&
                      !matrix[i][j].isFilledCell ? (
                      // Handle last game, (if user had filled some cell)
                      matrix[i][j].value
                    ) : (
                      <input
                        pattern="[1-9]{1}"
                        maxLength={1}
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
      </CustomTable>
      <div className="btn-game">
        <Button onClick={handleRestart}>
          <p>Restart</p>
        </Button>
        <Button onClick={handleSolve}>
          <p>Solve</p>
        </Button>
        <Link to="/">
          <Button>
            <p>Home</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Game;
