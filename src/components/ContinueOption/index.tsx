/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import { decrypt } from 'utils/saveFile';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'redux/hook';
import { updateData } from 'redux/reducers/gameSlice';
import { checkMainDataType } from 'utils/checkAndStandardizeSata';
import Option from 'components/Layouts/Option';

import './styles.css';
import { Dialog } from '@mui/material';
import Button from 'UI/Button';

import btnLong from '../../../assets/buttons/bg-long.svg';

function ContinueOption() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [rawData, setRawData] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenFile = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    if (rawData) {
      const data = decrypt(rawData);
      const fileData = JSON.parse(data);
      localStorage.setItem('data', JSON.stringify(fileData));
      if (checkMainDataType(fileData.matrix)) {
        dispatch(
          updateData({
            matrix: fileData.matrix,
            timer: fileData.timer,
            mistake: fileData.mistake,
            level: fileData.level,
          })
        );
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
    // If no data, return
    const data = localStorage.getItem('data');
    if (!data) {
      setOpen(true);
      console.log('No data on last game');
      return;
    }
    const localData = JSON.parse(data as string);
    dispatch(updateData(localData));
    navigate('/main/NONE');
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseMenu}
        aria-labelledby="menu"
        aria-describedby="menu"
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
          Không có dữ liệu! Vui lòng tạo ván mới.
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
            onClick={handleCloseMenu}
          >
            <p>Đồng ý</p>
          </Button>
        </div>
      </Dialog>
      <Option>
        {[
          { element: <p>Ván trước</p>, action: handleLastGame },
          {
            element: (
              <div>
                <input
                  type="file"
                  accept=".sdk"
                  ref={inputRef}
                  className="hidden"
                  onChange={handleOnChange}
                />
                <p>Mở file</p>
              </div>
            ),
            action: handleOpenFile,
          },
        ]}
      </Option>
    </>
  );
}

export default ContinueOption;
