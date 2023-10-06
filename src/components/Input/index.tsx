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
import SudokuTable from 'utils/generateData';
import solveSudoku from 'utils/solverSudoku';
import { useAppDispatch } from 'redux/hook';
import { updateData } from 'redux/reducers/gameSlice';
import { useNavigate } from 'react-router-dom';
import CustomTable from 'UI/CustomTable';

interface CoordinatesWrongCell {
  row: number;
  col: number;
  coordinatesInput: number[];
}

function Input() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rawSudoku = useRef<TableType>(new SudokuTable(9, []));

  const [tableSudoku, setTableSudoku] = useState<MainData[][]>([]);
  const [wrongCell, setWrongCell] = useState<CoordinatesWrongCell[]>([]);

  useEffect(() => {
    // Fill raw sudoku
    rawSudoku.current.emptyMatrix();
    setTableSudoku(rawSudoku.current.matrix);
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

  const handleRestart = () => {
    // Reset wrongCell
    setWrongCell([]);
    // Reset input value
    const inputCells: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('.input-cell');
    inputCells.forEach((input) => {
      input.value = '';
    });
    // Reset class wrong-cell
    const wrongCells: NodeListOf<HTMLElement> =
      document.querySelectorAll('.wrong-cell');
    wrongCells.forEach((cell) => {
      cell.classList.remove('wrong-cell');
    });
    // Fill new raw sudoku
    rawSudoku.current.emptyMatrix();
    setTableSudoku([...rawSudoku.current.matrix]);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id } = e.target;
    const [tag, row, col] = id.split('-');
    if (tag !== 'input') return;
    if (!(e.nativeEvent as InputEvent).data) {
      rawSudoku.current.editMatrix(Number(row), Number(col), 0, false);
      // Edit useState to rerender in react
      setTableSudoku([...rawSudoku.current.matrix]);
      return;
    }
    // ?? -> assign default value if e.nativeEvent.data is null or undefined
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
    }
    // Check valid input, compare with row and col
    const checker: number | number[] = rawSudoku.current.checkIfSafe(
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
            value: rawSudoku.current.matrix[i][j].value,
            isFilledCell: rawSudoku.current.matrix[i][j].isFilledCell,
            note: rawSudoku.current.matrix[i][j].note,
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
        rawSudoku.current.editMatrix(
          Number(row),
          Number(col),
          Number(e.target.value),
          true
        );
        // Edit useState to rerender in react
        setTableSudoku([...rawSudoku.current.matrix]);
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

  const handleSubmit = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (rawSudoku.current.matrix[i][j].value === 0) {
          rawSudoku.current.matrix[i][j].isFilledCell = false;
        }
      }
    }
    dispatch(updateData({ matrix: rawSudoku.current.matrix, timer: 0 }));
    navigate('/main/NONE');
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
                      backgroundColor:
                        cell.value !== 0 ? '#937d60a3' : 'transparent',
                      cursor: !cell.isFilledCell ? 'pointer' : 'default',
                      ...(!cell.isFilledCell ? { padding: '0px' } : null),
                    }}
                    id={`${i}-${j}`}
                    key={`key-${i}-${j}`}
                  >
                    <input
                      pattern="[1-9]{1}"
                      maxLength={1}
                      id={`input-${i}-${j}`}
                      className="input-cell"
                      type="number"
                      onChange={handleOnChange}
                    />
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
        <Button onClick={handleSubmit}>
          <p>Start Solve</p>
        </Button>
      </div>
    </div>
  );
}

export default Input;
