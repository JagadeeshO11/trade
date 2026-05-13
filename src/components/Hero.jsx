import React from 'react';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grid" aria-hidden="true">
        {Array.from({ length: 36 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-kicker">
            <span className="hero-kicker-dot" />
            <span>SEBI Registered Research Analyst</span>
          </div>

          <h1>
            With Us, You Can Always <span>Trade Safe.</span>
          </h1>

          <p>
            Trade Nexus provides expert intraday and delivery calls in Equity, F&amp;O, and Index
            Options on NSE &amp; BSE. 7+ years of trusted market research and advisory services
            from Bangalore.
          </p>

          <div className="sebi-badge">
            <span className="badge-icon" aria-hidden="true">Shield</span>
            <span>SEBI Reg. No: INH200008024</span>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric glass-card neon-border">
              <strong>7+ Years</strong>
              <span>Research-backed market coverage</span>
            </div>
            <div className="hero-metric glass-card neon-border">
              <strong>Multi-Segment</strong>
              <span>Equity, F&amp;O and index options focus</span>
            </div>
          </div>

          <div className="hero-btns">
            <button
              className="btn-primary"
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Plans
            </button>
            <button
              className="btn-outline"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-signal-wrap">
          <div className="hero-glow" />
          <div className="signal-card signal-card-static glass-card neon-border">
            <span className="signal-label">Signal Strength</span>
            <strong>94%</strong>
            <p>Active coverage across equity, options and delivery ideas.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
