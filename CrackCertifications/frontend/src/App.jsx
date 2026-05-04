import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import ModeSelect from './components/ModeSelect';
import Quiz from './components/Quiz';
import StudyNotes from './components/StudyNotes';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <Link to="/">🎓 Crack Certification</Link>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mode" element={<ModeSelect />} />
            <Route path="/quiz/:mode" element={<Quiz />} />
            <Route path="/study-notes" element={<StudyNotes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
