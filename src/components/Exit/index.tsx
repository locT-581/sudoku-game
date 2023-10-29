import Button from 'UI/Button';
import React from 'react';
import btnBg from '../../../assets/buttons/bg-short.svg';
import './styles.css';

function Exit({ setOpen }: { setOpen: () => void }) {
  return (
    <>
      <img
        src={btnBg}
        alt="sudoku-game"
        style={{
          position: 'absolute',
          zIndex: '-1',
          transform: 'scaleY(0.8)',
          top: '50',
        }}
      />
      <h1 className="exit-label">BẠN MUỐN ĐÓNG ỨNG DỤNG?</h1>
      <div className="exit-btn-group">
        <Button
          bg="1"
          onClick={() => {
            setOpen();
            window.close();
          }}
        >
          <p>Đồng ý!</p>
        </Button>
        <Button
          bg="2"
          onClick={() => {
            setOpen();
          }}
        >
          <p>Hủy</p>
        </Button>
      </div>
    </>
  );
}

export default Exit;
