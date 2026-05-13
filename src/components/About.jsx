import React from 'react';
import logo from '../logo.jpeg';

export default function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img">
            <img src={logo} alt="Trade Nexus" style={{ objectFit: 'contain', background: '#0a2540' }} />
            <div className="about-badge">7+ Years of Excellence</div>
          </div>

          <div className="about-content">
            <div className="tag" style={{ color: '#f0a500', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>WHO ARE WE?</div>
            <h2>Trade Nexus Research</h2>
            <p>
              Trade Nexus is a SEBI-registered financial market research company based in HSR Layout,
              Bangalore. We generate intraday as well as delivery calls in Stock Cash and F&O in NSE & BSE.
            </p>
            <p>
              Our calling facility ensures instant message delivery without any loss of time, so clients
              get sufficient time to execute their trades and fetch maximum profits.
            </p>
            <p>
              We provide recommendations in Equity, Equity Derivatives and Index Options. Our goal is to
              help clients accumulate maximum returns on investment through authentic advice with dedicated
              support and service.
            </p>

            <div className="about-features">
              {[
                { icon: '✅', text: 'SEBI Registered' },
                { icon: '📊', text: 'NSE & BSE Coverage' },
                { icon: '⚡', text: 'Instant Alerts' },
                { icon: '🎯', text: 'High Accuracy Calls' },
                { icon: '🛡️', text: 'Risk Management' },
                { icon: '📞', text: '24/7 Support' },
              ].map((f, i) => (
                <div className="feature-item" key={i}>
                  <div className="icon">{f.icon}</div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="disclaimer-box" style={{ marginTop: 50 }}>
          <h4>⚠️ Important Note</h4>
          <ul>
            <li>SEBI Registration Number: <strong>INH200008024</strong></li>
            <li>Official website: <strong>www.tradenexus.com</strong> | Email: <strong>support@tradenexus.com</strong> | Contact: <strong>70900-38951 / 84970-77442</strong></li>
            <li>We do NOT offer any Assured / Guaranteed / Profit Sharing / Demat Account or Broking Services / Portfolio Management Services.</li>
            <li>Clients are never asked for Banking or Broking Credentials. Do NOT share your Credit Card / Debit Card / Netbanking / Demat credentials with any employee.</li>
            <li>We accept payments only in our registered Bank Account. Check the "Payment" section for bank details.</li>
            <li>Investing in the market is subject to market risk. Read all Disclaimers and T&C carefully before investing.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
