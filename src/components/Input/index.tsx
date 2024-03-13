/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-template */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, TableCell, TableRow } from '@mui/material';

import { RootState } from 'redux/store';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { updateActiveCell, updateData } from 'redux/reducers/gameSlice';

import { MainData, TableType } from 'typings/MainData';

import Button from 'UI/Button';
import MenuPlaying from 'components/MenuPlaying';
import GameLayout from 'components/Layouts/GameLayout';
import Play from 'icons/Play';
import Menu from 'icons/Menu';
import Delete from 'icons/Delete';
import Restart from 'icons/Restart';
import SudokuTable from 'utils/generateData';
import solveSudoku from 'utils/solverSudoku';

import btnLong from '../../../assets/buttons/bg-long.svg';

import './styles.css';

function Input() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeCell } = useAppSelector((state: RootState) => state.gameSlice);
  const [open, setOpen] = React.useState(false);

  const positionActiveCell = useRef({
    row: activeCell.row,
    col: activeCell.col,
  });
  const rawSudoku = useRef<TableType>(new SudokuTable(9, []));
  /**
   * key: nguyên nhân(ô input mà làm cho ô đang nhập hiện tại bị đỏ)
   * value: tọa độ của ô đang có màu đỏ(bị trùng hiện tại)
   */
  const wrongCell = useRef<Map<string, { row: string; col: string }>>(
    new Map(),
  );
  const [tableSudoku, setTableSudoku] = useState<MainData[][]>([]);
  const [openError, setOpenError] = React.useState(false);
  const [error, setError] = useState<string>('');

  const drawWrongCell = () => {
    // remove all class wrong-cell
    const wrongCells: NodeListOf<HTMLElement> =
      document.querySelectorAll('.wrong-cell');
    wrongCells.forEach((cell) => {
      cell.classList.remove('wrong-cell');
    });
    // Add class wrong-cell for every cell have id is value of wrongCell.current
    wrongCell.current.forEach((mapValue) => {
      const cell: HTMLElement | null = document.getElementById(
        `${mapValue.row}-${mapValue.col}`,
      );
      if (cell) cell.classList.add('wrong-cell');
    });
  };

  const onChange = (e: HTMLElement): void => {
    // Extract id to get row and col of current cell
    const { id } = e;
    const [tag, row, col] = id.split('-');
    if (tag !== 'input') return;
    // Check if current cell have any wrong cell in any where and remove them
    // Kiểm tra nếu ô đang nhập hiện tại có bị trùng(tạo ra ô wrong cell) ở đâu không
    if (wrongCell.current.size > 0) {
      // Lấy những cái ô bị đánh dấu đỏ(wrong cell) mà do ô
      // đang nhập gây ra và xóa nó đi
      // Remove class wrong-cell
      // const cell: HTMLElement | null = document.getElementById(
      //   `${wrongCell.current.get(`${row}-${col}`)?.row}-${
      //     wrongCell.current.get(`${row}-${col}`)?.col
      //   }`
      // );
      // if (cell) cell.classList.remove('wrong-cell');
      wrongCell.current.delete(`${row}-${col}`);
    }
    // Check valid input(1-9), compare with row and col
    const checker: number | number[] = rawSudoku.current.checkIfSafe(
      Number(row),
      Number(col),
      Number(e.innerText),
    );
    // -1 is fine
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
      tableSudokuTemp[Number(row)][Number(col)].value = Number(e.innerText);
      // Try to solve with tableSudokuTemp
      const solved: boolean = solveSudoku(tableSudokuTemp, 0, 0);

      // If not solved, then add wrong cell
      if (!solved) {
        setError('Nếu đặt số này ở đây, sẽ không thể giải tiếp!');
        setOpenError(true);
        // Add current input to wrongCell
        wrongCell.current.set(`${row}-${col}`, { row, col });
        // Nếu chuẩn thì không cần, sẽ thêm ở useEffect
        // e.classList.add('wrong-cell');
      } else if (solved) {
        /* Nếu có thể giải */
        // Edit valid matrix after check
        rawSudoku.current.editMatrix(
          Number(row),
          Number(col),
          Number(e.innerText),
          true,
        );
        // Edit useState to rerender in react
        setTableSudoku([...rawSudoku.current.matrix]);
        // Reset tableSudokuTemp
        tableSudokuTemp = [];
        drawWrongCell();
      }
    } else if (typeof checker !== 'number') {
      // Nếu bị trùng với hàng, cột hoặc box
      wrongCell.current.set(`${row}-${col}`, {
        row: checker[0].toString(),
        col: checker[1].toString(),
      });
      // Nếu làm đúng sẽ không cần, xem trên useEffect
      // const cell: HTMLElement | null = document.getElementById(
      //   `${checker[0]}-${checker[1]}`
      // );
      // if (cell) cell.classList.add('wrong-cell');
    }
    drawWrongCell();
  };

  useEffect(() => {
    // Fill raw sudoku
    rawSudoku.current.emptyMatrix();
    setTableSudoku(rawSudoku.current.matrix);
    const handleKeyDown = (e: KeyboardEvent) => {
      // check if e.key not a 1-9 number
      if (
        (e.key < '1' || e.key > '9') &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete'
      ) {
        return;
      }
      const inputCell = document.getElementById(
        `input-${positionActiveCell.current.row}-${positionActiveCell.current.col}`,
      );
      if (inputCell?.innerText === e.key) return;
      if (inputCell) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          inputCell.innerText = '';
          // Edit matrix
          rawSudoku.current.editMatrix(
            positionActiveCell.current.row,
            positionActiveCell.current.col,
            0,
            false,
          );
          wrongCell.current.delete(
            `${positionActiveCell.current.row}-${positionActiveCell.current.col}`,
          );
          drawWrongCell();
        } else {
          inputCell.innerText = e.key;
          onChange(inputCell);
        }
      }
    };
    // Add event listener for input
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  // If activeCell change, then change add class active-cell for cell
  useEffect(() => {
    // delete all class active-cell
    const activeCells: NodeListOf<HTMLElement> =
      document.querySelectorAll('.active-cell');
    activeCells.forEach((cell) => {
      cell.classList.remove('active-cell');
    });
    const cell: HTMLElement | null = document.getElementById(
      `input-${positionActiveCell.current.row}-${positionActiveCell.current.col}`,
    );
    if (cell) {
      cell.classList.add('active-cell');
    }
  }, [positionActiveCell.current]);

  const handleRestart = () => {
    // Reset wrongCell
    wrongCell.current.clear();
    // Reset input value
    const inputCells: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('.input-cell');
    inputCells.forEach((input) => {
      input.innerText = '';
    });
    // Empty matrix
    rawSudoku.current.emptyMatrix();
    setTableSudoku([...rawSudoku.current.matrix]);
  };

  const handleSubmit = () => {
    if (wrongCell.current.size > 0) {
      setError('Sudoku không hợp lệ!');
      setOpenError(true);
      return;
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (rawSudoku.current.matrix[i][j].value === 0) {
          rawSudoku.current.matrix[i][j].isFilledCell = false;
        }
      }
    }
    dispatch(
      updateData({
        matrix: rawSudoku.current.matrix,
        timer: 0,
        mistake: 0,
        level: '',
      }),
    );
    navigate('/main/NONE');
  };

  const handleFocus = (i: number, j: number) => {
    dispatch(updateActiveCell({ row: i, col: j }));
  };

  const handleOpenMenu = () => {
    setOpen(true);
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  const handleDelete = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Backspace',
      }),
    );
  };
  return (
    <>
      <Dialog
        open={openError}
        onClose={handleCloseError}
        aria-labelledby="error"
        aria-describedby="error"
        PaperProps={{
          style: {
            display: 'flex',
            position: 'relative',
            margin: '0',
            width: '43%',
            height: '25%',
            background: 'none',
            boxShadow: 'none',
            alignItems: 'center',
          },
        }}
      >
        <p
          style={{
            position: 'absolute',
            zIndex: '1',
            fontSize: '1.4rem',
            color: 'var(--Pale-Yellow)',
            textAlign: 'center',
            padding: '0 60px',
            marginTop: '25px',
          }}
        >
          {error}
        </p>
        <div
          style={{
            width: '100%',
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={btnLong}
            alt="sudoku-game"
            style={{
              width: '100%',
              position: 'absolute',
              marginLeft: '-15px',
            }}
          />
          <Button
            bg="1"
            style={{ width: '30%', marginTop: '70px' }}
            onClick={handleCloseError}
          >
            <p>Đồng ý</p>
          </Button>
        </div>
      </Dialog>
      <GameLayout>
        {[
          <React.Fragment key="bsa1">
            {tableSudoku.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell
                    key={j}
                    className="cell"
                    sx={{
                      backgroundColor:
                        cell.value !== 0 ? '#937d60a3' : 'transparent',
                      cursor: !cell.isFilledCell ? 'pointer' : 'default',
                      ...(!cell.isFilledCell ? { padding: '0px' } : null),
                    }}
                    id={`${i}-${j}`}
                  >
                    <div
                      key={`${i}-${j}`}
                      id={`input-${i}-${j}`}
                      className="input-cell"
                      onClick={() => {
                        positionActiveCell.current = { row: i, col: j };
                        handleFocus(i, j);
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </React.Fragment>,
          <React.Fragment key="hfa">
            <Dialog
              id="menu-playing"
              open={open}
              onClose={handleCloseMenu}
              aria-labelledby="menu"
              aria-describedby="menu"
              PaperProps={{
                style: {
                  margin: '0',
                  width: '38%',
                  background: 'none',
                  aspectRatio: '1/1',
                  boxShadow: 'none',
                },
              }}
            >
              <MenuPlaying setOpen={handleCloseMenu} restart={handleRestart} />
            </Dialog>
            <Button bg="3" onClick={handleOpenMenu}>
              <Menu size="25" />
            </Button>
            <div className="group-handle-btn">
              <div>
                <Button bg="3" onClick={handleDelete}>
                  <Delete size="18" />
                </Button>
                <span>Xóa</span>
              </div>
              <div>
                <Button bg="3" onClick={handleRestart}>
                  <Restart size="35" />
                </Button>
                <span>Đặt lại</span>
              </div>
              <div key="group-94azs">
                <Button bg="3" onClick={handleSubmit}>
                  <Play size="25" />
                </Button>
                <span>Hoàn thành</span>
              </div>
            </div>
          </React.Fragment>,
        ]}
      </GameLayout>
    </>
  );
}

export default Input;
