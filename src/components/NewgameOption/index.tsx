import Button from 'UI/Button';
import { Link } from 'react-router-dom';

function NewGameOption() {
  return (
    <div className="warper">
      <Link to="/">x</Link>
      <Button>
        <p>Auto</p>
      </Button>
      <Button>
        <Link to="/newgame-option/input-type">Nhập các số</Link>
      </Button>
    </div>
  );
}

export default NewGameOption;
