import Button from 'UI/Button';
import { Link } from 'react-router-dom';

function NewGameOption() {
  return (
    <div className="warper">
      <Link to="/">x</Link>
      <Link to="/main-level" className="link">
        <Button>
          <p>Auto</p>
        </Button>
      </Link>
      <Button>
        <Link to="/newgame-option/input-type">Nhập các số</Link>
      </Button>
    </div>
  );
}

export default NewGameOption;
