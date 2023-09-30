/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import Button from 'UI/Button';
import { decrypt } from 'utils/saveFile';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'redux/hook';
import { updateData } from 'redux/reducers/gameSlice';
import { checkMainDataType } from 'utils/checkAndStandardizeSata';

function ContinueOption() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [rawData, setRawData] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleOpenFile = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    if (rawData) {
      const data = decrypt(rawData);
      localStorage.setItem('data', data);
      const matrix = JSON.parse(data);
      if (checkMainDataType(matrix)) {
        dispatch(updateData(matrix));
        navigate('/main/NONE');
      }
    }
  }, [rawData, dispatch, navigate]);

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

  const handleLastGame = () => {
    // Get data from local storage
    const data = localStorage.getItem('data');
    const matrix = data ? JSON.parse(data) : [];
    dispatch(updateData(matrix));
    navigate('/main/NONE');
  };

  return (
    <div className="warper">
      <Link to="/">x</Link>
      <Button onClick={handleLastGame}>
        <p>Last game</p>
      </Button>
      <Button onClick={handleOpenFile}>
        <div>
          <input
            type="file"
            accept=".sdk"
            ref={inputRef}
            className="hidden"
            onChange={handleOnChange}
          />
          <p>Open file</p>
        </div>
      </Button>
    </div>
  );
}

export default ContinueOption;
