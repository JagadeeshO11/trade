import React from 'react';

const reasons = [
  { icon: '🎯', title: 'Good Risk Reward Ratio', desc: 'Minimum 1:2 RR ratio on every call. We ensure you risk less to gain more with every trade.' },
  { icon: '🛡️', title: 'Risk Less to Gain More', desc: 'No need to risk big to gain big. With our good RR ratio strategy, you can always risk less and gain big.' },
  { icon: '⚡', title: 'Instant Call Delivery', desc: 'Our calling facility ensures instant message delivery without any loss of time for maximum trade execution.' },
  { icon: '📊', title: 'Transparent Track Record', desc: 'We maintain our track sheet with utmost transparency, updated daily after market hours.' },
  { icon: '🏆', title: '7+ Years Experience', desc: 'Over 7 years of trusted market research and advisory services with thousands of satisfied clients.' },
  { icon: '📞', title: 'Dedicated Support', desc: 'Expert support team available to assist you with all your queries and trade-related questions.' },
];

export default function WhyUs() {
  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-header">
          <div className="tag">WHY CHOOSE US</div>
          <h2>Main Reasons to Choose Trade Nexus</h2>
          <p>We combine expertise, technology and transparency to deliver the best trading experience.</p>
          <div className="divider" />
        </div>

        <div className="why-grid">
          {reasons.map((r, i) => (
            <div className="why-card" key={i}>
              <div className="icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
