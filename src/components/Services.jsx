import React from 'react';

const services = [
  {
    icon: '📈',
    title: 'Intraday Stock Recommendations',
    desc: 'Daily equity-cash calls for traders who believe in generating monthly income through day trading. Low Risk, High Accuracy, and High Profits with a strategic approach.',
  },
  {
    icon: '📦',
    title: 'Delivery Stock Recommendations',
    desc: 'Short/Medium/Long term recommendations for investors who believe in wealth creation over time. Stocks screened based on Technicals, Fundamentals, Valuation and Forecasting.',
  },
  {
    icon: '💼',
    title: 'Portfolio Review',
    desc: 'Portfolio in losses or profits? Want to know if it\'s the right time to exit or hold? Get your portfolio reviewed by our market experts.',
  },
  {
    icon: '📊',
    title: 'Equity Advisory',
    desc: 'Comprehensive equity research and advisory covering NSE & BSE listed stocks with detailed entry, exit and stop-loss levels.',
  },
  {
    icon: '🔄',
    title: 'Derivative Calls',
    desc: 'Expert F&O calls covering Stock Futures, Stock Options with precise strike price recommendations and risk management.',
  },
  {
    icon: '📉',
    title: 'Index Options',
    desc: 'Nifty and BankNifty index options calls with weekly and monthly expiry strategies for consistent returns.',
  },
];

export default function Services() {
  return (
    <section className="section section-alt" id="services">
      <div className="container">
        <div className="section-header">
          <div className="tag">WHAT WE PROVIDE</div>
          <h2>Our Services</h2>
          <p>Comprehensive market research and advisory services tailored for every type of investor and trader.</p>
          <div className="divider" />
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
