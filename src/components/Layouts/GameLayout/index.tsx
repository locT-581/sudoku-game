import { Table, TableBody } from '@mui/material';
import CustomTable from 'UI/CustomTable';
import React, { useEffect, useRef } from 'react';
import { RootState } from 'redux/store';
import { useAppSelector } from 'redux/hook';
import { useAnimate } from 'framer-motion';
import Button from 'UI/Button';
import avatar from '../../../../assets/logo/avatar.png';
import stoneBg from '../../../../assets/background/stone-bg.svg';
import paperBg from '../../../../assets/background/bg_paper.svg';
import netBg from '../../../../assets/background/net.png';
import './styles.css';

interface GameProps {
  children: React.ReactNode[];
}
function GameLayout({ children }: GameProps) {
  const { activeCell } = useAppSelector((state: RootState) => state.gameSlice);
  const positionActiveCell = useRef({
    row: activeCell.row,
    col: activeCell.col,
  });
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const btnInput = document.querySelectorAll('.btn-input button');
    btnInput.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.textContent;
        if (value)
          window.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: value,
            }),
          );
      });
    });

    animate([
      [
        '.left > img',
        { transform: 'translateY(0px)', opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.26,
          delay: 0.2,
          opacity: { duration: 0.1 },
        },
      ],
      [
        'footer > span',
        { opacity: 1 },
        {
          ease: 'easeOut',
          duration: 0.2,
        },
      ],
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    positionActiveCell.current = { ...activeCell };
  }, [activeCell]);

  return (
    <div className="warper-game" ref={scope}>
      <main>
        <div className="left">
          <img
            style={{ transform: 'translateY(-220px)', opacity: 0 }}
            src={avatar}
            alt="sudoku-game"
          />
        </div>
        <div className="center">
          <img src={stoneBg} alt="stone-bg" className="stone" />
          <img src={paperBg} alt="paper-bg" className="paper" />
          <img src={netBg} alt="net-bg" className="net" />
          <CustomTable className="table">
            <Table>
              <TableBody key="we3n">{children ? children[0] : ''}</TableBody>
            </Table>
          </CustomTable>
          <div className="btn-input">
            <Button bg="3" style={{ marginBottom: '-12px' }}>
              <p>1</p>
            </Button>
            <Button bg="3" style={{ marginBottom: '-18px' }}>
              <p>2</p>
            </Button>
            <Button bg="3" style={{ marginBottom: '-22px' }}>
              <p>3</p>
            </Button>
            <Button bg="3" style={{ marginBottom: '-25px' }}>
              <p>4</p>
            </Button>
            <Button bg="3" style={{ marginBottom: '-22px' }}>
              <p>5</p>
            </Button>
            <Button bg="3" style={{ marginBottom: '-16px' }}>
              <p>6</p>
            </Button>
            <Button bg="3" style={{ marginBottom: '-12px' }}>
              <p>7</p>
            </Button>
            <Button bg="3" style={{ marginBottom: '-2px' }}>
              <p>8</p>
            </Button>
            <Button bg="3" style={{ marginBottom: '7px' }}>
              <p>9</p>
            </Button>
          </div>
          {children[2] ? children[2] : ''}
        </div>

        <div className="right" key="12xs">
          {children ? children[1] : ''}
        </div>
      </main>
      <footer>
        <span style={{ fontSize: '1.7rem', marginBottom: '-17.5px' }}>©</span>
        <span> 2023 loct Sudoku-Game </span>
      </footer>
    </div>
  );
}

export default GameLayout;
