import { Link } from 'react-router-dom';
import Button from 'UI/Button';
import './styles.css';

function Home() {
  return (
    <div className="warper">
      <Button>
        <Link to="/continue-option">Continue</Link>
      </Button>
      <Button>
        <Link to="/newgame-option">New game</Link>
      </Button>
      <Button>
        <Link to="/score">Score</Link>
      </Button>
      <Button>
        <Link to="/confirm-exit">Exit</Link>
      </Button>
      <p>
        <Link to="/setting">Setting</Link>
      </p>
    </div>
  );
}

export default Home;
