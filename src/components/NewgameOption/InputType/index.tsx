/* eslint-disable no-plusplus */
import Button from 'UI/Button';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'redux/hook';
import { updateData } from 'redux/reducers/gameSlice';
import { MainData } from 'typings/MainData';
import { checkData } from 'utils/checkAndStandardizeSata';
import SudokuTable from 'utils/generateData';
import solveSudoku from 'utils/solverSudoku';

function InputType() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [rawData, setRawData] = React.useState<string>('');

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleOpenFile = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (rawData === '') return;
    const table = checkData(rawData);
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
          };
        }
      }
      if (solveSudoku(tableSudokuTemp, 0, 0)) {
        tableSudokuTemp = [];
        dispatch(updateData(sudoku.matrix));
        navigate('/main/NONE');
      } else {
        console.log('Không có lời giải');
      }
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
  return (
    <div className="warper">
      <Button onClick={handleOpenFile}>
        <div>
          <input
            type="file"
            accept=".txt"
            ref={inputRef}
            className="hidden"
            onChange={handleOnChange}
          />
          <p>Chọn file</p>
        </div>
      </Button>
      <Link to="/newgame-option/input-type/input-eachcell" className="link">
        <Button>
          <p>Nhập thủ công từng ô</p>
        </Button>
      </Link>
    </div>
  );
}

export default InputType;
