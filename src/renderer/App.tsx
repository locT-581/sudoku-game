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
import { MainData } from 'typings/MainData';
import { useReducer } from 'react';
import table, { fillValues, printSudoku } from 'logic';

interface State {
  data: MainData[][];
  isCount: boolean;
}

type Action =
  | { type: 'UPDATE_DATA'; payload: MainData[][] }
  | { type: 'START_COUNT'; payload: boolean }
  | { type: 'STOP_COUNT'; payload: boolean };

const initialState: State = {
  data: [],
  isCount: false,
};
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return {
        ...state,
        data: action.payload,
      };
    case 'START_COUNT':
      return {
        ...state,
        isCount: true,
      };
    case 'STOP_COUNT':
      return {
        ...state,
        isCount: false,
      };
    default:
      return state;
  }
};

export default function App() {
  const [state] = useReducer(reducer, initialState);
  console.log(state);

  console.log(table);
  fillValues();
  printSudoku();
  console.log(table);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Game />} />
        <Route path="/continue-option" element={<ContinueOption />} />
        <Route path="/newgame-option" element={<NewGameOption />} />
        <Route path="/newgame-option/input-type" element={<InputType />} />
        <Route path="/score" element={<Score />} />
        <Route path="/confirm-exit" element={<Exit />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}
