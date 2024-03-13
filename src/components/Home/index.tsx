import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAnimate, stagger } from 'framer-motion';
import { RootState } from 'redux/store';
import { useAppDispatch, useAppSelector } from 'redux/hook';
import { updateSetting } from 'redux/reducers/gameSlice';

import { Dialog } from '@mui/material';
import Button from 'UI/Button';
import Help from 'icons/Help';
import GitHub from 'icons/GitHub';
import MusicOn from 'icons/MusicOn';
import MusicOff from 'icons/MusicOff';
import Exit from 'components/Exit';
import btnBg from '../../../assets/buttons/bg.svg';
import avatar from '../../../assets/logo/avatar.png';
import aPaper from '../../../assets/background/aPaper.svg';
import './styles.css';

function Home() {
  const { setting } = useAppSelector((state: RootState) => state.gameSlice);
  const dispatch = useAppDispatch();
  const [scope, animate] = useAnimate();
  const [openExitDialog, setOpenExitDialog] = useState(false);

  useEffect(() => {
    animate([
      [
        '.avatar',
        { transform: 'translateY(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.26,
          delay: 0.2,
          opacity: { duration: 0.1 },
        },
      ],
      'footer',
      [
        '.btn-bg',
        { transform: 'translateY(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.3,
          opacity: { duration: 0.5 },
          at: '-0.085',
        },
      ],
      [
        '.home-btn-group > button',
        { transform: 'translateY(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.3,
          delay: stagger(0.07, { startDelay: 0.06 }),
          at: '-0.2',
        },
      ],
      [
        '.btn-opt > button',
        { scale: [0.8, 1.7, 1.7, 1], opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.35,
          delay: stagger(0.09, { startDelay: 0.1 }),
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

  const handleOpenExitDialog = () => {
    setOpenExitDialog(true);
  };
  const handleCloseExitDialog = () => {
    setOpenExitDialog(false);
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
  const [openScoreDialog, setOpenScoreDialog] = useState(false);
  const [score, setScore] = useState<{
    easy: number;
    medium: number;
    hard: number;
  }>({ easy: 0, medium: 0, hard: 0 });
  const handleOpenScore = () => {
    //  get record from local storage
    const record = localStorage.getItem('record');
    if (record) {
      const data = JSON.parse(record);
      setScore(data);
    }
    setOpenScoreDialog(true);
  };
  const handleCloseScore = () => {
    setOpenScoreDialog(false);
  };
  return (
    <div className="warper warper-home" ref={scope}>
      <iframe
        className="effect"
        title="effect"
        src="https://lottie.host/embed/8844739b-2029-48f6-90e9-887b41aba0ad/L5l11EYUU7.json"
      />
      <header>
        <img
          style={{ transform: 'translateY(-220px)', opacity: 0 }}
          src={avatar}
          className="avatar"
          alt="sudoku-game"
        />
      </header>
      <main>
        <div className="home-btn-group">
          <img
            src={btnBg}
            className="btn-bg"
            alt="sudoku-game"
            style={{ transform: 'translateY(100px)', opacity: 0 }}
          />
          <Button bg="1">
            <Link to="/continue-option">Tiếp tục</Link>
          </Button>
          <Button bg="2">
            <Link to="/newgame-option">Ván mới</Link>
          </Button>
          <Dialog
            open={openScoreDialog}
            onClose={handleCloseScore}
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
                padding: '40px 0',
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
                KỶ LỤC
              </h1>
              <table
                style={{
                  width: '100%',
                  height: '40%',
                  padding: '0px 40px 0px 40px',
                  fontSize: '1.4rem',
                }}
              >
                <tbody>
                  <tr>
                    <td>Dễ:</td>
                    <td>
                      {score.easy === 0
                        ? 'Chưa có kỷ lục'
                        : `${Math.floor(score.easy / 3600)
                            .toString()
                            .padStart(2, '0')}:${Math.floor(
                            (score.easy % 3600) / 60,
                          )
                            .toString()
                            .padStart(2, '0')}:${Math.floor(score.easy % 60)
                            .toString()
                            .padStart(2, '0')}`}
                    </td>
                  </tr>
                  <tr>
                    <td>Trung bình:</td>
                    <td>
                      {score.medium === 0
                        ? 'Chưa có kỷ lục'
                        : `${Math.floor(score.medium / 3600)
                            .toString()
                            .padStart(2, '0')}:${Math.floor(
                            (score.medium % 3600) / 60,
                          )
                            .toString()
                            .padStart(2, '0')}:${Math.floor(score.medium % 60)
                            .toString()
                            .padStart(2, '0')}`}
                    </td>
                  </tr>
                  <tr>
                    <td>Khó:</td>
                    <td>
                      {score.hard === 0
                        ? 'Chưa có kỷ lục'
                        : `${Math.floor(score.hard / 3600)
                            .toString()
                            .padStart(2, '0')}:${Math.floor(
                            (score.hard % 3600) / 60,
                          )
                            .toString()
                            .padStart(2, '0')}:${Math.floor(score.hard % 60)
                            .toString()
                            .padStart(2, '0')}`}
                    </td>
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
                  <Button
                    bg="1"
                    style={{ width: '45%' }}
                    onClick={handleCloseScore}
                  >
                    <p>Đồng ý</p>
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
          <Button bg="1" onClick={handleOpenScore}>
            <p>Điểm số</p>
          </Button>
          <Dialog
            id="menu-playing"
            open={openExitDialog}
            onClose={handleCloseExitDialog}
            aria-labelledby="menu"
            aria-describedby="menu"
            PaperProps={{
              style: {
                width: '38%',
                margin: '0',
                display: 'flex',
                color: 'var(--Pale-Yellow)',
                padding: '20px 10px 0px 10px',
                textAlign: 'center',
                background: 'none',
                aspectRatio: '1/1',
                boxShadow: 'none',
                justifyContent: 'center',
              },
            }}
          >
            <Exit setOpen={handleCloseExitDialog} />
          </Dialog>
          <Button bg="2" onClick={handleOpenExitDialog}>
            <p>Thoát</p>
          </Button>
          <div className="btn-opt">
            <Button bg="3" onClick={handleMusic}>
              {setting.music ? (
                <MusicOn className="btn-icon" size="20" />
              ) : (
                <MusicOff className="btn-icon" size="20" />
              )}
            </Button>
            <Button bg="3">
              <Link to="/help">
                <Help className="btn-icon" size="14" />
              </Link>
            </Button>
            <Button
              bg="3"
              onClick={() => {
                window.electron.ipcRenderer.sendMessage(
                  'open-github-link',
                  'https://github.com/locT-581/sudoku-game',
                );
              }}
            >
              <GitHub className="btn-icon" size="25" />
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

export default Home;
