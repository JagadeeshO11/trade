import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function HomeClosingPanel() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const terminalRows = [
    { label: 'NSE_EQ', value: 'BANKNIFTY', tone: 'success' },
    { label: 'STRATEGY', value: 'Intraday Momentum', tone: 'accent' },
    { label: 'RISK', value: 'Managed Exposure', tone: 'neutral' },
  ];

  const stats = [
    { val: '7+', label: 'Years Experience' },
    { val: '5000+', label: 'Happy Clients' },
    { val: '85%', label: 'Accuracy Rate' },
    { val: '3', label: 'Market Segments' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, form);
      toast.success(res.data.message);
      setForm({ name: '', email: '', phone: '' });
    } catch {
      toast.error('Failed to send. Please try again.');
    }

    setLoading(false);
  };

  return (
    <section className="section closing-section">
      <div className="container closing-wrap">
        <div className="closing-grid">
          <div className="hero-terminal glass-card neon-border">
            <div className="terminal-header">
              <div className="terminal-buttons" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="terminal-status">
                <span className="terminal-status-dot" />
                <span className="terminal-status-label">Live Terminal</span>
              </div>
            </div>

            <div className="terminal-body">
              <div className="terminal-line">
                <span className="terminal-prompt">$</span>
                <span>Signal confidence updated for active watchlist</span>
              </div>

              {terminalRows.map((row) => (
                <div className="terminal-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong className={`tone-${row.tone}`}>{row.value}</strong>
                </div>
              ))}

              <div className="terminal-chart" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
            </div>
          </div>

          <div className="hero-form-card glass-card neon-border">
            <h3>Get a Call from Our Team!</h3>
            <p>Fill in your details and our expert will reach out to you.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Get in Touch'}
              </button>
            </form>
          </div>
        </div>

        <div className="stats-bar closing-stats">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <h3>{s.val}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
