import { Link } from 'react-router-dom';
import Button from 'UI/Button';

function Level() {
  return (
    <div className="warper">
      <Link to="/main/EASY">
        <Button>
          <p>Easy</p>
        </Button>
      </Link>
      <Link to="/main/MEDIUM">
        <Button>
          <p>Medium</p>
        </Button>
      </Link>
      <Link to="/main/HARD">
        <Button>
          <p>Hard</p>
        </Button>
      </Link>
    </div>
  );
}

export default Level;
