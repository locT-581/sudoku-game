/* eslint-disable no-plusplus */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch } from 'redux/hook';
import { updateData } from 'redux/reducers/gameSlice';

import { MainData } from 'typings/MainData';

import solveSudoku from 'utils/solverSudoku';
import SudokuTable from 'utils/generateData';
import Option from 'components/Layouts/Option';
import checkStringDataAndConvertToMainData from 'utils/checkAndStandardizeSata';
import { Dialog } from '@mui/material';
import Button from 'UI/Button';

import btnLong from '../../../../assets/buttons/bg-long.svg';

function InputType() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [rawData, setRawData] = React.useState<string>('');

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleOpenFile = () => {
    inputRef.current?.click();
  };

  const [openError, setOpenError] = React.useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (rawData === '') return;
    const table = checkStringDataAndConvertToMainData(rawData);
    if (typeof table !== 'boolean') {
      const sudoku = new SudokuTable(9, table);
      let tableSudokuTemp: MainData[][] = [];
      // Copy sudokuUserPlay.current.matrix to tableSudokuTemp
      for (let i = 0; i < 9; i++) {
        tableSudokuTemp[i] = [];
        for (let j = 0; j < 9; j++) {
          tableSudokuTemp[i][j] = {
            value: sudoku.matrix[i][j].value,
            isFilledCell: sudoku.matrix[i][j].isFilledCell,
            note: sudoku.matrix[i][j].note,
          };
        }
      }
      if (solveSudoku(tableSudokuTemp, 0, 0)) {
        tableSudokuTemp = [];
        dispatch(
          updateData({
            matrix: sudoku.matrix,
            timer: 0,
            mistake: 0,
            level: '',
          }),
        );
        navigate('/main/NONE');
      }
    } else {
      setOpenError(true);
    }
  }, [rawData, inputRef.current?.value, dispatch, navigate]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        setRawData(data as string);
      };
      reader.readAsText(file);
    }
  };

  const handleCloseError = () => {
    setOpenError(false);
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
            marginTop: '40px',
          }}
        >
          Dữ liệu không hợp lệ!
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

      <Option>
        {[
          {
            element: (
              <div>
                <input
                  type="file"
                  accept=".txt"
                  ref={inputRef}
                  className="hidden"
                  onChange={handleOnChange}
                />
                <p>Thêm file</p>
              </div>
            ),
            action: handleOpenFile,
          },
          {
            element: (
              <Link
                to="/newgame-option/input-type/input-eachcell"
                className="link"
              >
                Nhập từng ô
              </Link>
            ),
            action: () => {},
          },
        ]}
      </Option>
    </>
  );
}

export default InputType;
