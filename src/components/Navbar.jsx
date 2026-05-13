import React, { useState } from 'react';
import logo from '../logo.jpeg';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Trade Nexus" />
        <div className="brand-text">
          <h1>Trade Nexus</h1>
          <span>Trade Smart</span>
        </div>
      </div>

      <ul className={`nav-links ${open ? 'open' : ''}`}>
        <li><a href="#home" onClick={() => scrollTo('home')}>Home</a></li>
        <li><a href="#about" onClick={() => scrollTo('about')}>About</a></li>
        <li><a href="#services" onClick={() => scrollTo('services')}>Services</a></li>
        <li><a href="#track" onClick={() => scrollTo('track')}>Track Record</a></li>
        <li><a href="#plans" onClick={() => scrollTo('plans')}>Plans</a></li>
        <li><a href="#contact" onClick={() => scrollTo('contact')} className="nav-cta">Get Started</a></li>
      </ul>

      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
        <span /><span /><span />
      </button>
    </nav>
  );
}
