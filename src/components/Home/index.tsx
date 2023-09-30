import { Link } from 'react-router-dom';

import './styles.css';
import Button from 'UI/Button';
import { encrypt, saveFile } from 'utils/saveFile';
import { useAppSelector } from 'redux/hook';
import { RootState } from 'redux/store';

function Home() {
  const { matrix } = useAppSelector((state: RootState) => state.gameSlice);
  const handleSaveFile = () => {
    console.log('save file, in save file');
    if (matrix.length === 0) {
      console.log('No data to save');
      return;
    }
    const blob = new Blob([encrypt(JSON.stringify(matrix, null))], {
      type: 'application/json',
    });
    saveFile(blob);
  };

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
        <div id="save" onClick={handleSaveFile}>
          save file
        </div>
        // style={{ display: 'none' }}
      }
    </div>
  );
}

export default Home;
