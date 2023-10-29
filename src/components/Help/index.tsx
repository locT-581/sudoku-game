import { stagger, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import Button from 'UI/Button';
import { Link } from 'react-router-dom';
import Home from 'icons/Home';
import avatar from '../../../assets/logo/avatar.png';
import stoneBg from '../../../assets/background/stone-bg.svg';
import paperBg from '../../../assets/background/bg_paper.svg';

import '../Layouts/GameLayout/styles.css';
import './styles.css';

function Help() {
  const [scope, animate] = useAnimate();

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
        '.paragraph > p',
        { opacity: 1, transform: 'translateY(0px)' },
        {
          opacity: { duration: 0.7 },
          ease: 'easeOut',
          duration: 0.5,
          delay: stagger(0.4),
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
  return (
    <div className="warper-game" ref={scope}>
      <main>
        <div className="left">
          <img
            className="avatar"
            src={avatar}
            alt="sudoku-game"
            style={{ transform: 'translateY(-220px)', opacity: 0 }}
          />
        </div>
        <div className="center">
          <img src={stoneBg} alt="stone-bg" className="stone" />
          <img src={paperBg} alt="paper-bg" className="paper" />
          <div className="paragraph">
            <p>
              Sudoku là một trò chơi câu đố sắp xếp các chữ số dựa trên logic.
            </p>
            <p>
              Trò chơi gồm có 9x9 ô trống. Trên mỗi hàng dọc hoặc hàng ngang chỉ
              có thể chứa các số từ 1-9 và không được có 2 số trùng nhau. Lưới
              được chia thành các khối 3×3 nhỏ hơn, mỗi khối 3×3 đó cũng chứa
              các số từ 1-9 và không được có các số trùng nhau.
            </p>
            <p>
              Tùy vào độ khó, sẽ có một số các ô số được điền sẵn trên lưới,
              người chơi sẽ phải điền các ô số còn lại, độ khó càng cao các ô
              điền sẵn càng ít. Câu đố được giải khi tất cả các ô số đều được
              điền đúng quy tắc.
            </p>
            <p>
              Để giải các câu đố ở cấp độ khó và giải nhanh, bạn cần sử dụng một
              số mẹo và học thêm các kỹ thuật Sudoku nâng cao hơn nữa.
            </p>
          </div>
        </div>
        <div className="right" key="12xs">
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'end',
              alignItems: 'center',
            }}
          >
            <Button bg="3">
              <Link to="/">
                <Home size="25" />
              </Link>
            </Button>
            Quay lại
          </div>
        </div>
      </main>
      <footer>
        <p style={{ fontSize: '1.7rem', marginBottom: '-17.5px' }}>©</p>
        <p> 2023 loct Sudoku-Game </p>
      </footer>
    </div>
  );
}

export default Help;
