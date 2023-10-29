import { Suspense, lazy } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SpinLoader from 'UI/SpinLoader';
import { useAppSelector } from 'redux/hook';
import { RootState } from 'redux/store';
import bgMusic from '../../assets/music/bg-music.mp3';
import './App.css';

const Home = lazy(() => import('components/Home'));
const Game = lazy(() => import('components/Game'));
const ContinueOption = lazy(() => import('components/ContinueOption'));
const NewGameOption = lazy(() => import('components/NewgameOption'));
const InputType = lazy(() => import('components/NewgameOption/InputType'));
const Level = lazy(() => import('components/NewgameOption/Level'));
const Input = lazy(() => import('components/Input'));
const Help = lazy(() => import('components/Help'));

export default function App() {
  const { setting } = useAppSelector((state: RootState) => state.gameSlice);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || e.key === 'Alt') {
      e.preventDefault();
    }
  });
  return (
    <Suspense fallback={<SpinLoader />}>
      {setting.music && (
        <audio src={bgMusic} loop autoPlay>
          <track kind="captions" />
        </audio>
      )}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main-level" element={<Level />} />
          <Route path="/main/:level" element={<Game />} />
          <Route path="/typemode" element={<Game />} />
          <Route path="/continue-option" element={<ContinueOption />} />
          <Route path="/newgame-option" element={<NewGameOption />} />
          <Route path="/newgame-option/input-type" element={<InputType />} />
          <Route path="/help" element={<Help />} />
          <Route
            path="/newgame-option/input-type/input-eachcell"
            element={<Input />}
          />
        </Routes>
      </Router>
    </Suspense>
  );
}
