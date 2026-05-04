import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const certifications = [
  {
    id: 'gh300',
    title: 'GH-300 GitHub Copilot',
    subtitle: 'GitHub Copilot Certification',
    icon: '🤖',
    available: true,
    color: '#6366f1',
  },
  {
    id: 'aws-ai',
    title: 'AWS AI Practitioner',
    subtitle: 'AI Foundations Certification',
    icon: '🧠',
    available: false,
    color: '#f59e0b',
  },
  {
    id: 'aws-cloud',
    title: 'AWS Cloud Practitioner',
    subtitle: 'Certified Cloud Practitioner',
    icon: '☁️',
    available: false,
    color: '#10b981',
  },
  {
    id: 'claude-ai',
    title: 'Claude AI Architect',
    subtitle: 'AI Architect Certification',
    icon: '🏗️',
    available: false,
    color: '#ef4444',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">🎓 Crack Certification</h1>
        <p className="home-subtitle">
          Practice and prepare for certification exams with confidence
        </p>
      </div>

      <div className="cert-section">
        <h2 className="section-heading">📜 Certifications</h2>
        <div className="cert-grid">
          {certifications.map(cert => (
            <div
              key={cert.id}
              className={`cert-card ${cert.available ? 'cert-available' : 'cert-coming'}`}
              style={{ borderTopColor: cert.color }}
              onClick={() => cert.available && navigate('/mode')}
            >
              <span className="cert-icon">{cert.icon}</span>
              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-subtitle">{cert.subtitle}</p>
              {cert.available ? (
                <button className="btn btn-primary">Start Exam →</button>
              ) : (
                <span className="cert-badge">🚧 Coming Soon</span>
              )}
            </div>
          ))}
        </div>
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
          <p>60 random questions, 100 min timer — real exam simulation</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>Track Progress</h3>
          <p>Review your performance and flagged questions</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📖</span>
          <h3>Study Notes</h3>
          <p>Review all questions with answers and explanations</p>
        </div>
      </div>
    </div>
  );
}
