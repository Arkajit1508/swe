import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';

const PaymentPage = () => {
  const [application, setApplication] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchPaymentStatus = async () => {
    try {
      const appRes = await api.get('/applications/me');
      if (appRes.success && appRes.application) {
        setApplication(appRes.application);
        if (appRes.application.paymentStatus === 'PAID') {
          const payRes = await api.get(`/payments/${appRes.application._id}`);
          if (payRes.success) {
            setPayment(payRes.payment);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load payment info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  const handleSimulatePayment = async () => {
    if (!application) return;

    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/payments/mock', {
        applicationId: application._id,
        amount: 500,
        paymentMethod: selectedMethod
      });

      if (res.success) {
        setMessage({
          type: 'success',
          text: `Payment of ₹500 was successfully processed! Txn ID: ${res.payment.transactionId}`
        });
        setIsModalOpen(false);
        fetchPaymentStatus();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Payment simulation failed' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading fee details...</div>;
  }

  const isPaid = application?.paymentStatus === 'PAID';

  return (
    <div>
      <h1 className="page-title">Application Fee Payment</h1>
      <p className="page-subtitle">
        Mandatory application processing fee for IEM Admission 2026-27 session
      </p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Invoice Summary Card */}
        <div className="card">
          <h3 className="section-title">Fee Invoice Breakdown</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Application Form Fee:</span>
              <span style={{ fontWeight: '600' }}>₹500.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Document Verification Charge:</span>
              <span style={{ fontWeight: '600', color: 'var(--success)' }}>₹0.00 (Waived)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Online Portal Access Fee:</span>
              <span style={{ fontWeight: '600', color: 'var(--success)' }}>₹0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)' }}>
              <span>Total Payable:</span>
              <span>₹500.00</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Payment Status:</div>
            {isPaid ? (
              <span className="status-badge status-APPROVED" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                ✓ PAID (₹500.00)
              </span>
            ) : (
              <span className="status-badge status-REJECTED" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                ● UNPAID / PENDING
              </span>
            )}
          </div>

          {!isPaid ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              💳 Proceed to Pay Application Fee (₹500)
            </button>
          ) : (
            <div className="alert alert-success" style={{ margin: 0 }}>
              Payment completed. Your application is eligible for official submission.
            </div>
          )}
        </div>

        {/* Transaction Receipt Details */}
        <div className="card">
          <h3 className="section-title">Transaction Receipt</h3>
          {isPaid && payment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
                <div style={{ fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace', fontSize: '1rem', marginTop: '0.15rem' }}>
                  {payment.transactionId}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Payment Date & Time:</span>
                <div style={{ fontWeight: '600' }}>
                  {new Date(payment.paymentDate).toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <div style={{ fontWeight: '600' }}>{payment.paymentMethod}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                <div style={{ fontWeight: '700', color: 'var(--success)', fontSize: '1.1rem' }}>
                  ₹{payment.amount}.00
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                * This is a computer-generated simulated receipt for Software Engineering Academic POC.
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No successful transaction recorded for this application yet.
            </p>
          )}
        </div>
      </div>

      {/* Demo Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="IEM Admission Fee Simulation Gateway"
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--warning-light)',
              border: '1px solid var(--warning-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: '#92400e',
              marginBottom: '1rem'
            }}
          >
            ⚠️ <strong>Academic POC Notice:</strong> This is a demo simulation gateway for the lab viva. No real money will be charged.
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Application Number:</div>
            <div style={{ fontWeight: '700', fontSize: '1rem' }}>{application?.applicationNumber}</div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Amount to Pay:</div>
            <div style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>₹500.00</div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Demo Payment Method</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['UPI (GPay / PhonePe / Paytm)', 'Net Banking (SBI / HDFC / ICICI)', 'Debit / Credit Card'].map(
                (method) => (
                  <label
                    key={method}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      backgroundColor: selectedMethod === method ? 'var(--primary-light)' : 'transparent',
                      borderColor: selectedMethod === method ? 'var(--primary)' : 'var(--border-color)'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={selectedMethod === method}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{method}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="btn btn-secondary btn-sm"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSimulatePayment}
            className="btn btn-success btn-sm"
            disabled={processing}
          >
            {processing ? 'Processing Demo Transaction...' : '✓ Complete Demo Payment (₹500)'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
