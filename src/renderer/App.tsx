import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Game from 'components/Game';
import Home from 'components/Home';

import './App.css';
import ContinueOption from 'components/ContinueOption';
import NewGameOption from 'components/NewgameOption';
import Score from 'components/Score';
import Setting from 'components/Setting';
import InputType from 'components/NewgameOption/InputType';
import Exit from 'components/Exit';
import Level from 'components/NewgameOption/Level';
import Input from 'components/Input';

// import lazy
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main-level" element={<Level />} />
        <Route path="/main/:level" element={<Game />} />
        <Route path="/typemode" element={<Game />} />
        <Route path="/continue-option" element={<ContinueOption />} />
        <Route path="/newgame-option" element={<NewGameOption />} />
        <Route path="/newgame-option/input-type" element={<InputType />} />
        <Route
          path="/newgame-option/input-type/input-eachcell"
          element={<Input />}
        />
        <Route path="/score" element={<Score />} />
        <Route path="/confirm-exit" element={<Exit />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}
