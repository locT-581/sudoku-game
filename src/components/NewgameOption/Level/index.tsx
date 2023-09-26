import { Link } from 'react-router-dom';
import Button from 'UI/Button';

function Level() {
  return (
    <div className="warper">
      <Link to="/main/EASY" className="link">
        <Button>
          <p>Easy</p>
        </Button>
      </Link>
      <Link to="/main/MEDIUM" className="link">
        <Button>
          <p>Medium</p>
        </Button>
      </Link>
      <Link to="/main/HARD" className="link">
        <Button>
          <p>Hard</p>
        </Button>
      </Link>
    </div>
  );
}

export default Level;
