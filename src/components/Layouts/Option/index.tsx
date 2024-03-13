import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stagger, useAnimate } from 'framer-motion';

import Back from 'icons/Back';
import MusicOn from 'icons/MusicOn';
import MusicOff from 'icons/MusicOff';
import Home from 'icons/Home';
import Button from 'UI/Button';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { updateSetting } from 'redux/reducers/gameSlice';
import { RootState } from 'redux/store';
import btnBg from '../../../../assets/buttons/bg-short.svg';
import avatar from '../../../../assets/logo/avatar.png';

import './styles.css';

interface childrenProps {
  element: React.ReactElement;
  action: () => void;
}
interface OptionProps {
  children: childrenProps[];
}

function Option({ children }: OptionProps) {
  const { setting } = useAppSelector((state: RootState) => state.gameSlice);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate([
      [
        '.avatar',
        { transform: 'translateY(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.2,
          delay: 0.12,
          opacity: { duration: 0.1 },
        },
      ],
      'footer',
      [
        '.option__btn-bg',
        { transform: 'translateY(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.23,
          opacity: { duration: 0.4 },
          at: '-0.085',
        },
      ],
      [
        '.option-btn-group > button',
        { transform: 'translateX(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.19,
          delay: stagger(0.02, { startDelay: 0.03 }),
          at: '-0.2',
        },
      ],
      [
        '.option-btn-opt > button',
        { scale: [0.8, 1.7, 1.7, 1], opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.3,
          delay: stagger(0.07, { startDelay: 0.1 }),
          at: '-0.2',
          times: [0, 0.65, 0.7, 1],
        },
      ],
      [
        'footer > span',
        { opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.2,
          at: 'footer',
        },
      ],
    ]);
  }, [animate]);

  const handleHome = () => {
    navigate('/');
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleMusic = () => {
    // set local storage
    localStorage.setItem(
      'setting',
      JSON.stringify({ ...setting, music: !setting.music }),
    );
    dispatch(
      updateSetting({
        ...setting,
        music: !setting.music,
      }),
    );
  };
  return (
    <div className="warper warper-home" ref={scope}>
      <header>
        <img
          style={{ transform: 'translateY(-220px)', opacity: 0 }}
          src={avatar}
          className="avatar"
          alt="sudoku-game"
        />
      </header>
      <main>
        <div className="option-btn-group">
          <img
            src={btnBg}
            className="option__btn-bg"
            alt="sudoku-game"
            style={{ transform: 'translateY(100px)', opacity: 0 }}
          />
          {children.map((child, index) => (
            <Button
              key={`${index + 1}aa`}
              bg="1"
              onClick={child.action}
              style={
                index % 2 === 0
                  ? { transform: 'translateX(40px)' }
                  : { transform: 'translateX(-40px)' }
              }
            >
              {child.element}
            </Button>
          ))}
          <div className="option-btn-opt">
            <Button bg="3" onClick={handleBack}>
              <Back className="btn-icon" size="20" />
            </Button>
            <Button bg="3" onClick={handleHome}>
              <Home className="btn-icon" size="20" />
            </Button>
            <Button bg="3" onClick={handleMusic}>
              {setting.music ? (
                <MusicOn className="btn-icon" size="20" />
              ) : (
                <MusicOff className="btn-icon" size="20" />
              )}
            </Button>
          </div>
        </div>
      </main>
      <footer>
        <span style={{ fontSize: '1.7rem', marginBottom: '-17.5px' }}>©</span>
        <span> 2023 loct Sudoku-Game </span>
      </footer>
    </div>
  );
}

export default Option;
