import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PaymentModal({ plan, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Payment gateway failed to load. Check your connection.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
        planId: plan.id,
        ...form,
      });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Trade Nexus',
        description: plan.name,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verify = await axios.post(`${import.meta.env.VITE_API_URL}/payment/verify`, response);
            if (verify.data.success) {
              toast.success('Payment successful! Welcome to Trade Nexus.');
              onClose();
            } else {
              toast.error('Payment verification failed.');
            }
          } catch {
            toast.error('Verification error. Contact support.');
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#0a2540' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3>Subscribe to Plan</h3>
        <p style={{ color: '#6c757d', fontSize: '0.88rem' }}>Enter your details to proceed with payment</p>

        <div className="plan-info">
          <h4>{plan.name}</h4>
          <span>₹{plan.price.toLocaleString('en-IN')}</span>
        </div>

        {plan.isTest && (
          <div style={{ background: '#d4edda', border: '1px solid #28a745', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '0.82rem', color: '#155724' }}>
            <strong>Test Mode:</strong> Use card <strong>4111 1111 1111 1111</strong>, any future expiry, any CVV. No real money will be charged.
          </div>
        )}

        <form onSubmit={handlePayment}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="form-submit" disabled={loading}
            style={plan.isTest ? { background: '#28a745' } : {}}>
            {loading ? 'Processing...' : plan.isTest ? 'Pay ₹1 (Test)' : `Pay ₹${plan.price.toLocaleString('en-IN')}`}
          </button>
        </form>

        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: 12, textAlign: 'center' }}>
          🔒 Secured by Razorpay. Your payment info is safe.
        </p>
      </div>
    </div>
  );
}
