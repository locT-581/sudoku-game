/* eslint-disable no-use-before-define */
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
import { Dialog, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { MainData, TableType } from 'typings/MainData';
import SudokuTable, { printSudoku } from 'utils/generateData';
import { Difficulty } from 'enum';
import { useNavigate, useParams } from 'react-router-dom';
import solveSudoku from 'utils/solverSudoku';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { RootState } from 'redux/store';
import {
  startCounting,
  stopCounting,
  updateActiveCell,
  updateData,
} from 'redux/reducers/gameSlice';
import GameLayout from 'components/Layouts/GameLayout';
import './styles.css';
import { encrypt, saveFile } from 'utils/saveFile';
import MenuPlaying from 'components/MenuPlaying';
import Button from 'UI/Button';
import Solve from 'icons/Solve';
import Note from 'icons/Note';
import Menu from 'icons/Menu';
import Heart from 'icons/Heart';
import Home from 'icons/Home';
import Restart from 'icons/Restart';
import Delete from 'icons/Delete';
import Save from 'icons/Save';
import btnLong from '../../../assets/buttons/bg-long.svg';
import aPaper from '../../../assets/background/aPaper.svg';

interface EndGame {
  title: string;
  content: string;
  level: string | undefined;
  time: string;
  record: string;
}

function Game() {
  const { level } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isCounting, activeCell } = useAppSelector(
    (state: RootState) => state.gameSlice
  );
  const [mistake, setMistake] = useState(level === 'NONE' ? data.mistake : 0);

  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);
  const isNoteModeRef = useRef<boolean>(isNoteMode);
  const [isSolveMode, setIsSolveMode] = useState<boolean>(false);

  const rawSudoku = useRef<TableType>(new SudokuTable(9, data.matrix));
  const sudokuRemoved = useRef<TableType>(new SudokuTable(9, []));
  const sudokuUserPlay = useRef<TableType>(new SudokuTable(9, []));
  const [tableSudoku, setTableSudoku] = useState<MainData[][]>([]);
  const [tableSudokuSolve, setTableSudokuSolve] = useState<MainData[][]>([]);

  const positionActiveCell = useRef({
    row: activeCell.row,
    col: activeCell.col,
  });

  /**
   * key: nguyên nhân(ô input mà làm cho ô đang nhập hiện tại bị đỏ)
   * value: tọa độ của ô đang có màu đỏ(bị trùng hiện tại)
   */
  const wrongCell = useRef<Map<string, { row: string; col: string }>>(
    new Map()
  );

  const [timer, setTimer] = useState<number>(level === 'NONE' ? data.timer : 0);

  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [openEndGame, setOpenEndGame] = React.useState(false);
  const [endGame, setEndGame] = useState<EndGame>({
    title: '',
    content: '',
    level: '',
    time: '',
    record: '',
  });

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
        `${mapValue.row}-${mapValue.col}`
      );
      if (cell) cell.classList.add('wrong-cell');
    });
  };

  const onChange = (e: HTMLElement | null): void => {
    if (!e) return;
    const [tag, row, col] = e.id.split('-');
    if (tag !== 'input') return;
    const value = e.lastChild?.textContent;

    // Clear note of this cell
    sudokuUserPlay.current.matrix[Number(row)][Number(col)].note = [];

    // Lấy những cái ô bị đánh dấu đỏ(wrong cell) mà do ô
    // đang nhập gây ra và xóa nó đi
    if (wrongCell.current.size > 0) {
      // Remove class wrong-cell
      // const cell: HTMLElement | null = document.getElementById(
      //   `${wrongCell.current.get(`${row}-${col}`)?.row}-${
      //     wrongCell.current.get(`${row}-${col}`)?.col
      //   }`
      // );
      // if (cell) cell.classList.remove('wrong-cell');
      wrongCell.current.delete(`${row}-${col}`);
    }

    // Check valid input, compare with row and col
    const checker: number | number[] = sudokuUserPlay.current.checkIfSafe(
      Number(row),
      Number(col),
      Number(value)
    );

    // CHECK VALID PASS
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
            note: sudokuUserPlay.current.matrix[i][j].note,
          };
        }
      }
      // Edit tableSudokuTemp to try solve, if ok then edit sudokuUserPlay.current.matrix
      tableSudokuTemp[Number(row)][Number(col)].value = Number(value);
      // Try to solve with tableSudokuTemp
      const solved: boolean = solveSudoku(tableSudokuTemp, 0, 0);

      // NẾU KHÔNG THỂ GIẢI TIẾP
      if (!solved) {
        console.log(
          'There is no further solution if you enter this number here!'
        );
        setOpenError(true);
        // Add current input to wrongCell
        wrongCell.current.set(`${row}-${col}`, { row, col });
        // e.classList.add('wrong-cell');
      } else if (solved) {
        // NẾU CÓ THỂ GIẢI -> PASS ALL
        // Edit valid matrix after check
        sudokuUserPlay.current.editMatrix(
          Number(row),
          Number(col),
          Number(value),
          false
        );
        // e.classList.remove('wrong-cell');
        // Edit useState to rerender in react
        setTableSudoku([...sudokuUserPlay.current.matrix]);
        // Reset tableSudokuTemp
        wrongCell.current.delete(`${row}-${col}`);
        tableSudokuTemp = [];
        document.getElementById(`${row}-${col}`)?.classList.add('pass-cell');
        drawWrongCell();
        return;
      }
    } else if (typeof checker !== 'number') {
      // Nếu bị trùng với hàng, cột hoặc box
      wrongCell.current.set(`${row}-${col}`, {
        row: checker[0].toString(),
        col: checker[1].toString(),
      });
      // const cell: HTMLElement | null = document.getElementById(
      //   `${checker[0]}-${checker[1]}`
      // );
      // if (cell) cell.classList.add('wrong-cell');
    }
    drawWrongCell();
    setMistake((prev) => prev + 1);
  };

  useEffect(() => {
    // Set data in localStorage = ''
    // When open Game, reset data to ''
    localStorage.setItem('data', '');

    // Có 1 ván cũ đang còn, người chơi sẽ mở ván đó (level là NONE)
    // LÀM VIỆC VỚI REMOVE SUDOKU
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
      // Ngược lại, tạo mới từ đầu
      // Fill raw sudoku
      rawSudoku.current.fillValues();
      // remove k digits from raw sudoku and assign to sudokuRemoved
      sudokuRemoved.current.matrix = rawSudoku.current.removeKDigits(
        Difficulty[level as keyof typeof Difficulty]
      );
      dispatch(updateData({ level, mistake: 0, timer: 0 }));
    }

    // LÀM VIỆC VỚI USERPLAY SUDOKU
    // copy sudokuRemoved to sudokuUserPlay, chuyển qua dùng sudokuUserPlay
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
    //  Bắt đầu tính giờ
    dispatch(startCounting());
    // Set tableSudoku để dùng làm biến render ra giao diện
    setTableSudoku(sudokuUserPlay.current.matrix);

    // When blur, stop counting
    const handleBlurWindow = () => {
      // dispatch(stopCounting());
      handleOpenMenu();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      // NẾU KHÔNG Ở CHẾ ĐỘ GHI CHÚ
      if (isSolveMode) return;
      if (!isNoteModeRef.current) {
        if (
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          ((e.key < '1' || e.key > '9') &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete')
        )
          return; // check if e.key not a 1-9 number

        // Clear note when user change value of cell
        sudokuUserPlay.current.matrix[positionActiveCell.current.row][
          positionActiveCell.current.col
        ].note = [];

        const inputCell = document.querySelector(
          `#input-${positionActiveCell.current.row}-${positionActiveCell.current.col} > span`
        ) as HTMLElement;
        if (inputCell) {
          if (inputCell.innerText === e.key) return;
          if (e.key === 'Backspace' || e.key === 'Delete') {
            // Nếu xóa bỏ giá trị của ô input
            // Edit matrix
            sudokuUserPlay.current.editMatrix(
              positionActiveCell.current.row,
              positionActiveCell.current.col,
              0,
              false
            );
            wrongCell.current.delete(
              `${positionActiveCell.current.row}-${positionActiveCell.current.col}`
            );
            drawWrongCell();
            // Remove class wrong-cell
            // const cell: HTMLElement | null = document.getElementById(
            //   `${
            //     wrongCell.current.get(
            //       `${positionActiveCell.current.row}-${positionActiveCell.current.col}`
            //     )?.row
            //   }-${
            //     wrongCell.current.get(
            //       `${positionActiveCell.current.row}-${positionActiveCell.current.col}`
            //     )?.col
            //   }`
            // );
            // if (cell) cell.classList.remove('wrong-cell');
            inputCell.innerText = '';
          } else {
            inputCell.innerText = e.key;
            onChange(
              document.getElementById(
                `input-${positionActiveCell.current.row}-${positionActiveCell.current.col}`
              )
            );
          }
        }
      } else {
        // NẾU ĐANG Ở CHẾ ĐỘ GHI CHÚ
        if (
          (e.key < '1' || e.key > '9') &&
          e.key !== 'Backspace' &&
          e.key !== 'Delete'
        )
          return; // check if e.key not a 1-9 number

        const { row, col } = positionActiveCell.current;

        // Check if number is already in note
        if (
          sudokuUserPlay.current.matrix[row][col].note?.includes(Number(e.key))
        ) {
          // Remove number from note
          sudokuUserPlay.current.matrix[row][col].note =
            sudokuUserPlay.current.matrix[row][col].note?.filter(
              (n) => n !== Number(e.key)
            );
        } else {
          // Add number to note
          sudokuUserPlay.current.matrix[row][col].note = [
            ...sudokuUserPlay.current.matrix[row][col].note!,
            Number(e.key),
          ];
          // Clear value of this cell
          sudokuUserPlay.current.matrix[row][col].value = 0;
        }
        setTableSudoku([...sudokuUserPlay.current.matrix]);
      }
    };

    window.addEventListener('blur', handleBlurWindow);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('blur', handleBlurWindow);
      window.removeEventListener('keydown', handleKeydown);
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
      `input-${positionActiveCell.current.row}-${positionActiveCell.current.col}`
    );
    if (cell) cell.classList.add('active-cell');
  }, [positionActiveCell.current]);

  useEffect(() => {
    // update in localStorage
    localStorage.setItem(
      'data',
      JSON.stringify({
        matrix: tableSudoku,
        timer,
        mistake,
        level: data.level,
      })
    );
    if (mistake >= 3) {
      dispatch(stopCounting());
      console.log('You lose!');
      // get data from local storage
      const record = localStorage.getItem('record');
      const localData = record
        ? JSON.parse(record)
        : { easy: 0, medium: 0, hard: 0 };
      setEndGame({
        title: 'THẬT TIẾC!',
        content: 'BẠN ĐÃ THUA!',
        level: data.level === '' ? 'Tùy chọn' : data.level,
        time: `${Math.floor(timer / 3600)
          .toString()
          .padStart(2, '0')}:${Math.floor((timer % 3600) / 60)
          .toString()
          .padStart(2, '0')}:${Math.floor(timer % 60)
          .toString()
          .padStart(2, '0')}`,
        record:
          data.level === ''
            ? 'Chế độ tùy chọn'
            : localData[data.level.toLowerCase()] === 0
            ? 'Chưa có kỷ lục'
            : `${Math.floor(localData[data.level.toLowerCase()] / 3600)
                .toString()
                .padStart(2, '0')}:${Math.floor(
                (localData[data.level.toLowerCase()] % 3600) / 60
              )
                .toString()
                .padStart(2, '0')}:${Math.floor(
                localData[data.level.toLowerCase()] % 60
              )
                .toString()
                .padStart(2, '0')}`,
      });
      setOpenEndGame(true);
    }
  }, [mistake]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    // Start timer
    if (isCounting) {
      interval = setTimeout(() => {
        setTimer((prev) => {
          // Update sudokuUserPlay.current.matrix to localStorage
          localStorage.setItem(
            'data',
            JSON.stringify({
              matrix: tableSudoku,
              timer,
              mistake,
              level: data.level,
            })
          );
          return prev + 1;
        });
      }, 1000);
      // dispatch(updateData({ timer }));
    }
    return () => {
      clearTimeout(interval);
    };
  }, [timer, isCounting]);

  useEffect(() => {
    // Copy a newTableSudoku from tableSudoku
    if (tableSudoku.length === 0) return;
    const newTableSudoku: MainData[][] = [];
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
      JSON.stringify({
        matrix: newTableSudoku,
        timer,
        mistake,
        level: data.level,
      })
    );
    // Update data in redux
    dispatch(
      updateData({ matrix: newTableSudoku, timer, mistake, level: data.level })
    );

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

      // get data from local storage
      const record = localStorage.getItem('record');
      const localData = record
        ? JSON.parse(record)
        : { easy: 0, medium: 0, hard: 0 };
      // Update record
      if (data.level === 'EASY') {
        if (localData.easy === 0 || localData.easy > timer) {
          localData.easy = timer;
        }
      } else if (data.level === 'MEDIUM') {
        if (localData.medium === 0 || localData.medium > timer) {
          localData.medium = timer;
        }
      } else if (data.level === 'HARD') {
        if (localData.hard === 0 || localData.hard > timer) {
          localData.hard = timer;
        }
      }
      // update in localStorage
      localStorage.setItem('record', JSON.stringify(localData));
      console.log('You win!');
      setEndGame({
        title: 'CHÚC MỪNG!',
        content: 'BẠN ĐÃ HOÀN THÀNH TRÒ CHƠI!',
        level: data.level === '' ? 'Tùy chọn' : data.level,
        time: `${Math.floor(timer / 3600)
          .toString()
          .padStart(2, '0')}:${Math.floor((timer % 3600) / 60)
          .toString()
          .padStart(2, '0')}:${Math.floor(timer % 60)
          .toString()
          .padStart(2, '0')}`,
        record:
          data.level === ''
            ? 'Chế độ tùy chọn'
            : localData[data.level.toLowerCase()] === 0
            ? 'Chưa có kỷ lục'
            : `${Math.floor(localData[data.level.toLowerCase()] / 3600)
                .toString()
                .padStart(2, '0')}:${Math.floor(
                (localData[data.level.toLowerCase()] % 3600) / 60
              )
                .toString()
                .padStart(2, '0')}:${Math.floor(
                localData[data.level.toLowerCase()] % 60
              )
                .toString()
                .padStart(2, '0')}`,
      });
      setOpenEndGame(true);
    }
  }, [tableSudoku]);

  const handleRestart = () => {
    setIsNoteMode(false);
    setIsSolveMode(false);
    // Reset pass-cell
    const passCells: NodeListOf<HTMLElement> =
      document.querySelectorAll('.pass-cell');
    passCells.forEach((cell) => {
      cell.classList.remove('pass-cell');
    });
    // Reset wrongCell
    wrongCell.current.clear();
    // Reset input value
    const inputCells: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('.input-cell > span');
    inputCells.forEach((input) => {
      input.innerText = '';
    });
    // Reset class wrong-cell
    const wrongCells: NodeListOf<HTMLElement> =
      document.querySelectorAll('.wrong-cell');
    wrongCells.forEach((cell) => {
      cell.classList.remove('wrong-cell');
    });
    if (data.level === '') {
      navigate('/');
    } else {
      // Fill new raw sudoku
      rawSudoku.current.fillValues();
      // Copy raw sudoku to sudokuRemoved
      sudokuRemoved.current.matrix = rawSudoku.current.removeKDigits(
        Difficulty[data.level as keyof typeof Difficulty]
      );
      // Copy sudokuRemoved to sudokuUserPlay
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
      // Reset mistake
      setMistake(0);
    }
  };

  const handleSolve = () => {
    setIsSolveMode((prev) => !prev);
    // Reset wrongCell
    wrongCell.current.clear();
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
          value: sudokuUserPlay.current.matrix[i][j].value,
          isFilledCell: sudokuUserPlay.current.matrix[i][j].isFilledCell,
          note: sudokuUserPlay.current.matrix[i][j].note,
        };
      }
    }
    solveSudoku(tableSudokuTemp, 0, 0);
    printSudoku(tableSudokuTemp);

    setTableSudokuSolve(tableSudokuTemp);

    if (isCounting) {
      dispatch(stopCounting());
    } else {
      dispatch(startCounting());
    }
    tableSudokuTemp = [];
  };

  const handleNote = () => {
    setIsNoteMode((prev) => {
      isNoteModeRef.current = !prev;
      return !prev;
    });
  };

  const handleOpenMenu = () => {
    dispatch(stopCounting());
    setOpen(true);
  };

  const handleCloseMenu = () => {
    dispatch(startCounting());
    setOpen(false);
  };

  const handleFocus = (i: number, j: number) => {
    dispatch(updateActiveCell({ row: i, col: j }));
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleCloseEndGame = () => {
    setOpenEndGame(false);
    handleRestart();
  };

  const handleSaveFile = () => {
    // get data from local storage
    const dataItem = localStorage.getItem('data');
    const localData = dataItem
      ? JSON.parse(dataItem)
      : { matrix: [], timer: 0, mistake: 0, level: '' };
    if (localData.matrix.length === 0) {
      console.log('No data to save');
      return;
    }
    const blob = new Blob([encrypt(JSON.stringify(localData, null))], {
      type: 'text/plain',
    });
    saveFile(blob);
  };

  const handleDelete = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Backspace',
      })
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
          Nếu đặt số này ở đây, sẽ không thể giải tiếp!
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

      <Dialog
        open={openEndGame}
        onClose={handleCloseEndGame}
        aria-labelledby="error"
        aria-describedby="error"
        PaperProps={{
          style: {
            display: 'flex',
            position: 'relative',
            margin: '0',
            width: '43%',
            height: '100%',
            background: 'none',
            boxShadow: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <img
          src={aPaper}
          alt="sudoku-game"
          style={{ position: 'absolute', width: '100%', zIndex: '-1' }}
        />
        <div
          style={{
            padding: '20px 0',
            height: '60%',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <h1
            style={{
              fontSize: '2.8rem',
              color: '#FF5757',
              padding: '0 5px',
              textShadow: '4px 5px 4px #00000055',
            }}
          >
            {endGame.title}
          </h1>
          <h4
            style={{
              fontSize: '1.3rem',
              color: '#283618',
              padding: '0 70px',
            }}
          >
            {endGame.content}
          </h4>
          <table
            style={{
              width: '100%',
              padding: '0px 40px 0px 40px',
              fontSize: '1.4rem',
            }}
          >
            <tbody>
              <tr>
                <td>Cấp độ:</td>
                <td>
                  {endGame.level === 'EASY'
                    ? 'Dễ'
                    : endGame.level === 'MEDIUM'
                    ? 'Trung bình'
                    : endGame.level === 'HARD'
                    ? 'Khó'
                    : endGame.level}
                </td>
              </tr>
              <tr>
                <td>Thời gian:</td>
                <td>{endGame.time}</td>
              </tr>
              <tr>
                <td>Kỷ lục:</td>
                <td>{endGame.record}</td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              padding: '0 50px',
              fontSize: '1.2rem',
              display: 'flex',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Button bg="3" style={{ width: '25%' }} onClick={handleHome}>
                <Home size="20" />
              </Button>
              <p>Màn hình chính</p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Button
                bg="3"
                style={{ width: '25%' }}
                onClick={handleCloseEndGame}
              >
                <Restart size="30" />
              </Button>
              <p>Chơi lại</p>
            </div>
          </div>
        </div>
      </Dialog>
      <GameLayout>
        {[
          <React.Fragment key="axv">
            {(isSolveMode ? tableSudokuSolve : tableSudoku).map((row, i) => (
              <TableRow
                key={`key-${i + 1}`}
                sx={{
                  filter: !isCounting && !isSolveMode ? 'blur(3px)' : 'none',
                }}
              >
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
                    {cell.isFilledCell || isSolveMode ? (
                      cell.value
                    ) : data.matrix.length > 0 &&
                      data.matrix[i][j].value !== 0 &&
                      !data.matrix[i][j].isFilledCell ? (
                      data.matrix[i][j].value // Handle last game, (if user had filled some cell)
                    ) : (
                      <div
                        id={`input-${i}-${j}`}
                        className="input-cell"
                        onClick={() => {
                          positionActiveCell.current = { row: i, col: j };
                          handleFocus(i, j);
                        }}
                      >
                        {cell.note.length > 0 && (
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
                                        fontSize: '0.8rem !important',
                                        lineHeight: '0 !important',
                                      }}
                                      key={`key-${jNote}`}
                                    >
                                      {cell.note.indexOf(col1) > -1 && col1}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                        <span
                          style={{
                            position: 'absolute',
                            display:
                              isNoteMode || cell.note.length > 0
                                ? 'none'
                                : 'block',
                          }}
                        />
                      </div>
                    )}
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
                <Button bg="3" onClick={handleSaveFile}>
                  <Save size="18" />
                </Button>
                <span>Lưu</span>
              </div>
              <div>
                <Button bg="3" onClick={handleNote}>
                  <Note size="25" color={isNoteMode ? '#DDA15E' : undefined} />
                </Button>
                <span>Ghi chú</span>
              </div>
              <div key="group-94azs">
                <Button bg="3" onClick={handleSolve}>
                  <Solve size="25" />
                </Button>
                <span>{isSolveMode ? 'Quay lại' : 'Lời giải'}</span>
              </div>
            </div>
          </React.Fragment>,
          <React.Fragment key="amk">
            <div className="header-playing">
              <div className="mistake">
                <Heart
                  size="20"
                  disable={mistake >= 3}
                  style={{ marginTop: '-4px' }}
                />
                <Heart
                  disable={mistake >= 2}
                  size="20"
                  style={{ marginTop: '-6px' }}
                />
                <Heart
                  disable={mistake >= 1}
                  size="20"
                  style={{ marginTop: '-10px' }}
                />
              </div>
              <div className="timer">{`${Math.floor(timer / 3600)
                .toString()
                .padStart(2, '0')}:${Math.floor((timer % 3600) / 60)
                .toString()
                .padStart(2, '0')}:${Math.floor(timer % 60)
                .toString()
                .padStart(2, '0')}`}</div>
              <div className="mode">{isNoteMode ? 'Note' : 'Play'}</div>
            </div>
          </React.Fragment>,
        ]}
      </GameLayout>
    </>
  );
}

export default Game;
