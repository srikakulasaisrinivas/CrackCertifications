import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">🎓 Crack Certification</h1>
        <p className="home-subtitle">
          Practice and prepare for certification exams with confidence
        </p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/mode')}
        >
          🚀 Copilot GH300 Exam
        </button>
      </div>
      <div className="home-features">
        <div className="feature-card">
          <span className="feature-icon">📝</span>
          <h3>Practice Mode</h3>
          <p>Learn at your own pace with instant feedback</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⏱️</span>
          <h3>Exam Mode</h3>
          <p>Simulate real exam conditions with a timer</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>Track Progress</h3>
          <p>Review your performance and flagged questions</p>
        </div>
      </div>
    </div>
  );
}

