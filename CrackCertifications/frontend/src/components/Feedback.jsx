import { useState } from 'react';
import '../styles/Feedback.css';

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', type: 'bug', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(`[CrackCert Feedback] ${form.type} — from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nType: ${form.type}\n\n${form.message}`
    );
    window.open(`mailto:srikakulasaisrinivas@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="feedback">
        <div className="feedback-success">
          <h2>✅ Thank you for your feedback!</h2>
          <p>Your email client should have opened. If not, please email us directly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback">
      <h2>💬 Share Your Feedback</h2>
      <p className="feedback-subtitle">Help us improve CrackCertification — report bugs, suggest features, or flag incorrect questions.</p>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="feedback-row">
          <input
            type="text"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
        </div>
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="bug">🐛 Bug Report</option>
          <option value="wrong-question">❌ Wrong Question / Answer</option>
          <option value="feature">💡 Feature Request</option>
          <option value="general">💬 General Feedback</option>
        </select>
        <textarea
          placeholder="Describe your feedback in detail..."
          rows={5}
          required
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        />
        <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
          📧 Send Feedback
        </button>
      </form>
    </div>
  );
}
