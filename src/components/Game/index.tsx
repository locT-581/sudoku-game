/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
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
import {
  startCounting,
  stopCounting,
  updateData,
} from 'redux/reducers/gameSlice';

interface CoordinatesWrongCell {
  row: number;
  col: number;
  coordinatesInput: number[];
}

function Game() {
  const dispatch = useAppDispatch();
  const { data, isCounting } = useAppSelector(
    (state: RootState) => state.gameSlice
  );
  const { level } = useParams();

  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);
  const isNoteModeRef = useRef<boolean>(isNoteMode);
  const rawSudoku = useRef<TableType>(new SudokuTable(9, data.matrix));
  const sudokuRemoved = useRef<TableType>(new SudokuTable(9, []));
  const sudokuUserPlay = useRef<TableType>(new SudokuTable(9, []));
  const [tableSudoku, setTableSudoku] = useState<MainData[][]>([]);
  const [wrongCell, setWrongCell] = useState<CoordinatesWrongCell[]>([]);
  const [timer, setTimer] = useState<number>(level === 'NONE' ? data.timer : 0);

  useEffect(() => {
    // Set data in localStorage = ''
    localStorage.setItem('data', '');
    if (data.matrix.length > 0 && level === 'NONE') {
      // Copy raw sudoku to sudokuRemoved
      for (let i = 0; i < 9; i++) {
        sudokuRemoved.current.matrix[i] = [];
        for (let j = 0; j < 9; j++) {
          sudokuRemoved.current.matrix[i][j] = {
            value: rawSudoku.current.matrix[i][j].value,
            isFilledCell: rawSudoku.current.matrix[i][j].isFilledCell,
            note: rawSudoku.current.matrix[i][j].note,
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
          note: sudokuRemoved.current.matrix[i][j].note,
        };
      }
    }
    dispatch(startCounting());
    setTableSudoku(sudokuUserPlay.current.matrix);
    const handleBlurWindow = () => {
      dispatch(stopCounting());
    };
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isNoteModeRef.current) {
        if (
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown'
        ) {
          e.preventDefault();
        }
      } else {
        // check if key is number
        if (!Number.isNaN(Number(e.key)) && e.key !== '0') {
          const { id } = document.querySelector('.note-active') as HTMLElement;
          const [tag, row, col] = id.split('-');
          // check if number is already in note
          if (
            !sudokuUserPlay.current.matrix[Number(row)][Number(col)].note?.find(
              (n) => n === Number(e.key)
            )
          ) {
            // Add number to note
            sudokuUserPlay.current.matrix[Number(row)][Number(col)].note = [
              ...sudokuUserPlay.current.matrix[Number(row)][Number(col)].note!,
              Number(e.key),
            ];
            // Clear value of this cell
            sudokuUserPlay.current.matrix[Number(row)][Number(col)].value = 0;
            // clear in html
            const input: HTMLElement | null = document.getElementById(
              `input-${row}-${col}`
            );
            input?.setAttribute('value', '');
          } else {
            // remove number from note
            sudokuUserPlay.current.matrix[Number(row)][Number(col)].note =
              sudokuUserPlay.current.matrix[Number(row)][
                Number(col)
              ].note?.filter((n) => n !== Number(e.key));
          }
          setTableSudoku([...sudokuUserPlay.current.matrix]);
        } else {
          console.log('Enter from 1-9');
        }
      }
    };

    // window.addEventListener('blur', handleBlurWindow);
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('blur', handleBlurWindow);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    if (isNoteMode) {
      // Play change to Note mode -> blur all input tag
      // blur all input tag
      const inputCells: NodeListOf<HTMLInputElement> =
        document.querySelectorAll('.input-cell');
      inputCells.forEach((input) => {
        input.blur();
      });
    } else {
      // Note change to Play mode -> remove class note-active
      document.querySelector('.note-active')?.classList.remove('note-active');
    }
    console.log(sudokuUserPlay.current.matrix);
  }, [isNoteMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    // Start timer
    if (isCounting) {
      interval = setTimeout(() => {
        setTimer((prev) => {
          // Update sudokuUserPlay.current.matrix to localStorage
          localStorage.setItem(
            'data',
            JSON.stringify({ matrix: tableSudoku, timer })
          );
          return prev + 1;
        });
      }, 1000);
      dispatch(updateData({ timer }));
    }
    return () => {
      clearTimeout(interval);
    };
  }, [timer, isCounting]);

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
    // Copy a newTableSudoku from tableSudoku
    const newTableSudoku: MainData[][] = [];
    if (tableSudoku.length === 0) return;
    for (let i = 0; i < 9; i++) {
      newTableSudoku[i] = [];
      for (let j = 0; j < 9; j++) {
        newTableSudoku[i][j] = {
          value: tableSudoku[i][j].value,
          isFilledCell: tableSudoku[i][j].isFilledCell,
          note: tableSudoku[i][j].note,
        };
      }
    }
    // Update sudokuUserPlay.current.matrix to localStorage
    localStorage.setItem(
      'data',
      JSON.stringify({ matrix: newTableSudoku, timer })
    );
    // Update data in redux
    dispatch(updateData({ matrix: newTableSudoku }));

    // Check if user win
    let isWin = true;
    for (let i = 0; i < 9; i++) {
      if (!isWin) break;
      for (let j = 0; j < 9; j++) {
        if (newTableSudoku[i][j].value === 0) {
          isWin = false;
          break;
        }
      }
    }
    if (isWin) {
      dispatch(stopCounting());
      console.log('You win!');
    }
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
    // Copy raw sudoku to sudokuRemoved
    sudokuRemoved.current.matrix = rawSudoku.current.removeKDigits(
      Difficulty[level as keyof typeof Difficulty]
    );
    // copy sudokuRemoved to sudokuUserPlay
    for (let i = 0; i < 9; i++) {
      sudokuUserPlay.current.matrix[i] = [];
      for (let j = 0; j < 9; j++) {
        sudokuUserPlay.current.matrix[i][j] = {
          value: sudokuRemoved.current.matrix[i][j].value,
          isFilledCell: sudokuRemoved.current.matrix[i][j].isFilledCell,
          note: sudokuRemoved.current.matrix[i][j].note,
        };
      }
    }
    setTableSudoku([...sudokuUserPlay.current.matrix]);
    // Reset timer
    setTimer(0);
    dispatch(startCounting());
  };

  const handleSolve = () => {
    // remove class wrong-cell
    const wrongCells: NodeListOf<HTMLElement> =
      document.querySelectorAll('.wrong-cell');
    wrongCells.forEach((cell) => {
      cell.classList.remove('wrong-cell');
    });
    let tableSudokuTemp: MainData[][] = [];
    // Copy sudokuUserPlay.current.matrix to tableSudokuTemp
    for (let i = 0; i < 9; i++) {
      tableSudokuTemp[i] = [];
      for (let j = 0; j < 9; j++) {
        tableSudokuTemp[i][j] = {
          value: sudokuRemoved.current.matrix[i][j].value,
          isFilledCell: sudokuRemoved.current.matrix[i][j].isFilledCell,
          note: sudokuRemoved.current.matrix[i][j].note,
        };
      }
    }
    solveSudoku(tableSudokuTemp, 0, 0);
    printSudoku(tableSudokuTemp);
    tableSudokuTemp = [];
    if (isCounting) {
      dispatch(stopCounting());
    } else {
      dispatch(startCounting());
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id } = e.target;
    const [tag, row, col] = id.split('-');
    if (tag !== 'input') return;
    // ?? -> assign default value if e.nativeEvent.data is null or undefined
    e.target.value = (e.nativeEvent as InputEvent).data ?? '';
    if (e.target.value === '0') {
      e.target.value = '';
      console.log('Enter from 1-9');
      return;
    }
    // Clear note of this cell
    sudokuUserPlay.current.matrix[Number(row)][Number(col)].note = [];
    // check if e.target.value isn't number then return
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
  const handleNote = () => {
    setIsNoteMode((prev) => {
      isNoteModeRef.current = !prev;
      return !prev;
    });
  };
  const handleClickOnNote = (e: React.MouseEvent<HTMLDivElement>) => {
    const [tag, row, col] = e.currentTarget.id.split('-');
    document.querySelector('.note-active')?.classList.remove('note-active');
    document
      .getElementById(`input-${row}-${col}`)
      ?.classList.add('note-active');
  };
  return (
    <div className="warper">
      <div>{`${Math.floor(timer / 3600)
        .toString()
        .padStart(2, '0')}:${Math.floor((timer % 3600) / 60)
        .toString()
        .padStart(2, '0')}:${Math.floor(timer % 60)
        .toString()
        .padStart(2, '0')}`}</div>
      <div>{isNoteMode ? 'Note' : 'Play'}</div>
      <CustomTable>
        <Table>
          <TableBody>
            {tableSudoku.map((row, i) => (
              <TableRow key={`key-${i + 1}`}>
                {row.map((cell, j) => (
                  <TableCell
                    className="cell"
                    sx={{
                      position: 'relative',
                      backgroundColor: cell.isFilledCell
                        ? '#937d60a3'
                        : 'transparent',
                      cursor: !cell.isFilledCell ? 'pointer' : 'default',
                      ...(!cell.isFilledCell ? { padding: '0px' } : null),
                    }}
                    id={`${i}-${j}`}
                    key={`key-${i}-${j}`}
                  >
                    {isCounting ? (
                      cell.isFilledCell ? (
                        cell.value
                      ) : data.matrix.length > 0 &&
                        data.matrix[i][j].value !== 0 &&
                        !data.matrix[i][j].isFilledCell ? (
                        // Handle last game, (if user had filled some cell)
                        data.matrix[i][j].value
                      ) : (
                        <>
                          <input
                            style={{
                              position: 'absolute',
                              inset: '0',
                            }}
                            pattern="[1-9]{1}"
                            maxLength={1}
                            id={`input-${i}-${j}`}
                            className="input-cell"
                            type="number"
                            onChange={handleOnChange}
                          />
                          {cell.note.length > 0 || isNoteMode ? (
                            <div
                              style={{
                                backgroundColor: 'transparent',
                                position: 'absolute',
                                inset: '0',
                                zIndex: isNoteMode ? 1 : -1,
                              }}
                              id={`note-${i}-${j}`}
                              onClick={handleClickOnNote}
                              className="note"
                            >
                              <Table>
                                <TableBody className="border-none">
                                  {[
                                    [1, 2, 3],
                                    [4, 5, 6],
                                    [7, 8, 9],
                                  ].map((row1, iNote) => (
                                    <TableRow
                                      key={`key-${iNote}`}
                                      sx={{ border: 0 }}
                                    >
                                      {row1.map((col1, jNote) => (
                                        <TableCell
                                          id={`note-${i}-${j}-${iNote}-${jNote}`}
                                          className="note-text"
                                          align="center"
                                          sx={{
                                            border: 'none !important',
                                            fontSize: '0.8rem',
                                          }}
                                          key={`key-${jNote}`}
                                        >
                                          {cell.note.indexOf(col1) !== -1
                                            ? col1
                                            : ''}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <> </>
                          )}
                        </>
                      )
                    ) : (
                      ''
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
        <Button onClick={handleNote}>
          <p>Note</p>
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
