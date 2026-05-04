import { useState } from 'react';
import '../styles/Feedback.css';

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', type: 'bug', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `[CrackCert Feedback] ${form.type} — from ${form.name}`,
          from_name: form.name,
          email: form.email,
          type: form.type,
          message: form.message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSent(true);
      } else {
        setError('Failed to send feedback. Please try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="feedback">
        <div className="feedback-success">
          <h2>✅ Thank you for your feedback!</h2>
          <p>Your feedback has been sent successfully. We'll review it soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback">
      <h2>💬 Share Your Feedback</h2>
      <p className="feedback-subtitle">Help us improve CrackCertification — report bugs, suggest features, or flag incorrect questions.</p>
      {error && <p className="feedback-error">{error}</p>}
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
          {sending ? '⏳ Sending...' : '📧 Send Feedback'}
        </button>
      </form>
    </div>
  );
}
