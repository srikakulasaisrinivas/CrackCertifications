import { useNavigate } from 'react-router-dom';
import '../styles/ModeSelect.css';

export default function ModeSelect() {
  const navigate = useNavigate();

  return (
    <div className="mode-select">
      <h2>Choose Your Mode</h2>
      <p className="mode-description">Select how you want to practice the GH300 exam</p>
      <div className="mode-cards">
        <div className="mode-card" onClick={() => navigate('/quiz/practice')}>
          <span className="mode-icon">📝</span>
          <h3>Practice Mode</h3>
          <ul>
            <li>Answer at your own pace</li>
            <li>See correct answer after each question</li>
            <li>Flag questions for review</li>
            <li>No time limit</li>
          </ul>
          <button className="btn btn-primary">Start Practice</button>
        </div>
        <div className="mode-card" onClick={() => navigate('/quiz/exam')}>
          <span className="mode-icon">⏱️</span>
          <h3>Exam Mode</h3>
          <ul>
            <li>Timed exam simulation (60 min)</li>
            <li>No immediate feedback</li>
            <li>Results shown after submission</li>
            <li>Flag questions for review</li>
          </ul>
          <button className="btn btn-secondary">Start Exam</button>
        </div>
      </div>
    </div>
  );
}

