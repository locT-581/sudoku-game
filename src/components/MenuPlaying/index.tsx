import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stagger, useAnimate } from 'framer-motion';

import { useAppDispatch, useAppSelector } from 'redux/hook';
import { updateSetting } from 'redux/reducers/gameSlice';
import { RootState } from 'redux/store';

import Button from 'UI/Button';
import MusicOn from 'icons/MusicOn';
import MusicOff from 'icons/MusicOff';
import btnBg from '../../../assets/buttons/bg-short.svg';

import './styles.css';

function MenuPlaying({
  setOpen,
  restart,
}: {
  setOpen: () => void;
  restart: () => void;
}) {
  const { setting } = useAppSelector((state: RootState) => state.gameSlice);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [scope, animate] = useAnimate();
  useEffect(() => {
    animate([
      [
        scope.current,
        { transform: 'translateY(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.2,
          delay: 0.1,
          opacity: { duration: 0.3 },
        },
      ],
      [
        '.menu > button',
        { transform: 'translateX(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.2,
          delay: stagger(0.02, { startDelay: 0.03 }),
          at: '-0.2',
        },
      ],
      [
        '.menu > div > span',
        { opacity: 1, transform: 'rotate(0deg)' },
        {
          ease: 'easeOut',
          duration: 0.15,
        },
      ],
      [
        '.music',
        { scale: [1, 2, 2, 1], opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.25,
          at: '-0.3',
          times: [0, 0.65, 0.655, 1],
        },
      ],
    ]);
  }, [animate, scope]);
  const handleHome = () => {
    navigate('/');
  };
  const handleMusic = () => {
    // set local storage
    localStorage.setItem(
      'setting',
      JSON.stringify({ ...setting, music: !setting.music })
    );
    dispatch(
      updateSetting({
        ...setting,
        music: !setting.music,
      })
    );
  };
  return (
    <div className="menu" ref={scope}>
      <img src={btnBg} className="menu-bg" alt="sudoku-game" />
      <Button
        bg="1"
        style={{ transform: 'translateX(-25px)', opacity: 0 }}
        onClick={setOpen}
      >
        <p>Tiếp tục</p>
      </Button>
      <Button
        bg="1"
        onClick={() => {
          setOpen();
          restart();
        }}
        style={{ transform: 'translateX(25px)', opacity: 0 }}
      >
        <p>Bắt đầu lại</p>
      </Button>
      <Button
        bg="1"
        onClick={handleHome}
        style={{ transform: 'translateX(-25px)', opacity: 0 }}
      >
        <p>Màn hình chính</p>
      </Button>
      <div>
        <span style={{ opacity: 0, transform: 'rotate(12deg)' }}>Âm thanh</span>
        <Button bg="3" className="music" onClick={handleMusic}>
          {setting.music ? (
            <MusicOn className="btn-icon" size="20" />
          ) : (
            <MusicOff className="btn-icon" size="20" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default MenuPlaying;
