import { ButtonProps } from 'typings/Button';

import bg1 from '../../../assets/buttons/1.svg';
import bg2 from '../../../assets/buttons/2.svg';
import bg3 from '../../../assets/buttons/3.svg';
import './styles.css';

function Button({ children, className = '', bg, onClick, style }: ButtonProps) {
  const bgImage = ['', bg1, bg2, bg3];
  return (
    // eslint-disable-next-line react/button-has-type
    <button className={`${className} btn`} onClick={onClick} style={style}>
      <img src={bgImage[Number(bg)]} alt="button" />
      <div className="btn-label">{children}</div>
    </button>
  );
}
export default Button;
