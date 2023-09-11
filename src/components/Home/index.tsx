import { Link } from 'react-router-dom';

import './styles.css';
import Button from 'UI/Button';
import { encrypt, saveFile } from 'functions';

interface cell {
  value: number;
  isQuestion: boolean;
  note: number[];
}
function Home() {
  // A table have 9 rows and 9 columns
  const table: cell[][] = [
    [
      {
        value: 3,
        isQuestion: true,
        note: [],
      },
      {
        value: 0,
        isQuestion: false,
        note: [],
      },
    ],
    [
      {
        value: 6,
        isQuestion: false,
        note: [],
      },
      {
        value: 1,
        isQuestion: true,
        note: [],
      },
    ],
  ];
  const blob = new Blob([encrypt(JSON.stringify(table, null))], {
    type: 'application/json',
  });

  // { type: "text/plain" }

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
      {
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div id="save" onClick={() => saveFile(blob)}>
          save file
        </div>
      }
    </div>
  );
}

export default Home;
