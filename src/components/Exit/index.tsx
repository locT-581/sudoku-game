import Button from 'UI/Button';
import { Link } from 'react-router-dom';

function Exit() {
  return (
    <div className="warper">
      <h1>Do you want exit?</h1>
      <div>
        <Button
          onClick={() => {
            window.close();
          }}
        >
          <p>Yes!</p>
        </Button>
        <Button>
          <Link to="/">Cancel</Link>
        </Button>
      </div>
    </div>
  );
}

export default Exit;
