import React from 'react';
import logo from '../logo.jpeg';

export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={logo} alt="Trade Nexus" />
          <h3>Trade Nexus</h3>
          <p>
            SEBI Registered Research Analyst providing expert market research and advisory services
            in Equity, F&O and Index Options since 2017.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#f0a500' }}>SEBI Reg. No: INH200008024</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            {[['home', 'Home'], ['about', 'About Us'], ['services', 'Services'], ['track', 'Track Record'], ['plans', 'Plans & Pricing'], ['disclaimer', 'Disclaimer']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={() => scrollTo(id)}>{label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {['Intraday Calls', 'Delivery Calls', 'Portfolio Review', 'Equity Advisory', 'Derivative Calls', 'Index Options'].map(s => (
              <li key={s}><a href="#services" onClick={() => scrollTo('services')}>{s}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <div className="footer-contact-item">
            <span className="ci">📍</span>
            <span>HSR Layout, 7th Sector, Near 5th Main Road, Bangalore - 560102 (Near Reliance Digital)</span>
          </div>
          <div className="footer-contact-item">
            <span className="ci">📞</span>
            <span>70900-38951 / 84970-77442</span>
          </div>
          <div className="footer-contact-item">
            <span className="ci">✉️</span>
            <span>support@tradenexus.com</span>
          </div>
          <div className="footer-contact-item">
            <span className="ci">🌐</span>
            <span>www.tradenexus.com</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Trade Nexus. All rights reserved.</p>
        <p>SEBI Reg. No: INH200008024 | HSR Layout, Bangalore</p>
      </div>
    </footer>
  );
}
