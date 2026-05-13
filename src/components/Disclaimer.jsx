import React from 'react';

export default function Disclaimer() {
  return (
    <section className="section section-alt" id="disclaimer">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="section-header">
          <div className="tag">LEGAL</div>
          <h2>Disclaimer & Standard Warning</h2>
          <div className="divider" />
        </div>

        <div className="disclaimer-box">
          <h4>Disclaimer</h4>
          <p>
            Registration granted by SEBI, enlistment as RA with exchange and certification from NISM in no way
            guarantee performance of the Research Analyst or provide any assurance of returns to investors.
          </p>
        </div>

        <div className="disclaimer-box">
          <h4>Standard Warning</h4>
          <p>
            Investment in securities market are subject to market risk. Read all the related documents carefully
            before investing. Past performance is not indicative of future results.
          </p>
        </div>

        <div className="disclaimer-box">
          <h4>Payment Policy</h4>
          <p>
            Trade Nexus accepts payments only in its registered Bank Account. Please verify bank details on our
            official website before making any payment. We are not responsible for payments made to unauthorized accounts.
          </p>
        </div>
      </div>
    </section>
  );
}
