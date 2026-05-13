import React, { useState } from 'react';

export default function TrackRecord() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [segment, setSegment] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    alert(`Track record for ${segment} from ${from} to ${to} will be displayed here.`);
  };

  return (
    <section className="section" id="track">
      <div className="container">
        <div className="section-header">
          <div className="tag">PERFORMANCE</div>
          <h2>Daily Track Record</h2>
          <p>
            The Daily Track Record is a report of past performance of services provided to our paid customers,
            updated daily after market hours. We maintain our track sheet with utmost transparency.
          </p>
          <div className="divider" />
        </div>

        <div className="track-form">
          <p style={{ color: '#6c757d', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.7 }}>
            <strong>Note:</strong> Profit/loss shown in track record does not include additional costs like
            Brokerage fee, STT, Short Term Capital Gains, Slippage costs, etc. Customers are advised to
            factor these costs prior to calculating past performance.
          </p>
          <form onSubmit={handleTrack}>
            <div className="form-row">
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0a2540', display: 'block', marginBottom: 6 }}>From Date</label>
                <input type="date" value={from} onChange={e => setFrom(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0a2540', display: 'block', marginBottom: 6 }}>To Date</label>
                <input type="date" value={to} onChange={e => setTo(e.target.value)} required />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0a2540', display: 'block', marginBottom: 6 }}>Select Segment</label>
              <select value={segment} onChange={e => setSegment(e.target.value)} required style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e0e0e0', borderRadius: 6, fontSize: '0.95rem', outline: 'none', background: '#fff' }}>
                <option value="">-- Select One --</option>
                <option value="equity">Equity</option>
                <option value="derivative">Derivative</option>
                <option value="index">Index Options</option>
              </select>
            </div>
            <button type="submit" className="form-submit">Track Now</button>
          </form>
        </div>
      </div>
    </section>
  );
}
