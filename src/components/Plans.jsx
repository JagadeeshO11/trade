import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Plans({ onSelectPlan }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/payment/plans`)
      .then(res => setPlans(res.data.plans))
      .catch(() => {
        setPlans([
          { id: 'test_payment', name: '🧪 Test Payment', price: 1, description: 'Test payment of ₹1 to verify Razorpay integration', isTest: true },
          { id: 'equity_monthly', name: 'Equity Monthly', price: 4999, description: 'Intraday & Delivery Equity Calls for 1 Month' },
          { id: 'equity_quarterly', name: 'Equity Quarterly', price: 12999, description: 'Intraday & Delivery Equity Calls for 3 Months' },
          { id: 'derivative_monthly', name: 'Derivative Monthly', price: 6999, description: 'F&O Calls - Index & Stock Options for 1 Month' },
          { id: 'derivative_quarterly', name: 'Derivative Quarterly', price: 17999, description: 'F&O Calls - Index & Stock Options for 3 Months' },
          { id: 'index_monthly', name: 'Index Monthly', price: 5999, description: 'Index Options Calls for 1 Month' },
          { id: 'combo_monthly', name: 'Combo Monthly', price: 9999, description: 'Equity + Derivative + Index Calls for 1 Month' },
        ]);
      });
  }, []);

  const popularId = 'combo_monthly';

  return (
    <section className="section section-alt" id="plans">
      <div className="container">
        <div className="section-header">
          <div className="tag">PRICING</div>
          <h2>Choose Your Plan</h2>
          <p>Transparent pricing with no hidden charges. All plans include dedicated support and daily market calls.</p>
          <div className="divider" />
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div className={`plan-card ${plan.id === popularId ? 'popular' : ''} ${plan.isTest ? 'test-plan' : ''}`} key={plan.id}>
              {plan.id === popularId && <div className="popular-badge">⭐ Most Popular</div>}
              {plan.isTest && <div className="popular-badge" style={{ background: '#28a745', color: '#fff' }}>🧪 Test Mode</div>}
              <h3>{plan.name}</h3>
              <div className="plan-price">
                ₹{plan.price.toLocaleString('en-IN')}
                <span> /plan</span>
              </div>
              <p className="plan-desc">{plan.description}</p>
              {!plan.isTest && (
                <ul style={{ listStyle: 'none', marginBottom: 24, textAlign: 'left' }}>
                  {['Daily Market Calls', 'WhatsApp Alerts', 'Entry & Exit Levels', 'Stop Loss Guidance', 'Expert Support'].map((f, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: '#555', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#f0a500' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              {plan.isTest && (
                <ul style={{ listStyle: 'none', marginBottom: 24, textAlign: 'left' }}>
                  {['Verify Razorpay integration', 'Use test card: 4111 1111 1111 1111', 'Any future expiry & CVV', 'No real money charged'].map((f, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: '#555', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#28a745' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              <button className="plan-btn" style={plan.isTest ? { background: '#28a745' } : {}} onClick={() => onSelectPlan(plan)}>
                {plan.isTest ? 'Pay ₹1 Test' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 30, color: '#6c757d', fontSize: '0.82rem' }}>
          * GST applicable as per government norms. Payments accepted only in registered bank account.
        </p>
      </div>
    </section>
  );
}
