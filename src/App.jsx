import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TradingChart from './components/TradingChart';
import About from './components/About';
import Services from './components/Services';
import TrackRecord from './components/TrackRecord';
import Plans from './components/Plans';
import WhyUs from './components/WhyUs';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import HomeClosingPanel from './components/HomeClosingPanel';

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  window.onscroll = () => setShowScroll(window.scrollY > 400);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Navbar />

      <div style={{ marginTop: 70 }}>
        <Hero />
      </div>

      <TradingChart />

      <About />
      <Services />
      <TrackRecord />
      <WhyUs />
      <Plans onSelectPlan={setSelectedPlan} />
      <Disclaimer />
      <HomeClosingPanel />
      <Footer />

      {selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}

      {showScroll && (
        <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </button>
      )}
    </>
  );
}

export default App;
