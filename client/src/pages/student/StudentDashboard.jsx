import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ProgressTracker from '../../components/ProgressTracker';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const appRes = await api.get('/applications/me');
        if (appRes.success) {
          setData(appRes);
        }

        const notifRes = await api.get('/notifications');
        if (notifRes.success) {
          setNotifications(notifRes.notifications.slice(0, 4));
        }
      } catch (err) {
        setError('Failed to load dashboard details');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading applicant dashboard...</div>;
  }

  const app = data?.application;
  const docs = data?.documents || [];
  const payment = data?.payment;

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          border: 'none'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              Welcome, {user?.name}!
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
              Application No: <strong>{app?.applicationNumber || 'N/A'}</strong> | Program:{' '}
              <strong>{app?.courseSelection?.program || 'Not Selected Yet'}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.85rem' }}>Current Status:</span>
            <StatusBadge status={app?.status} />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Rejection Alert if rejected */}
      {app?.status === 'REJECTED' && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <div>
            <strong>Application Needs Attention:</strong> {app.rejectionReason || 'Please review your uploaded documents and correct the errors.'}
            <div style={{ marginTop: '0.5rem' }}>
              <Link to="/student/application" className="btn btn-danger btn-sm">
                Edit & Re-Submit Application
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Admission Lifecycle Progress
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Track the real-time review, verification, and allocation status of your application
        </p>
        <ProgressTracker currentStatus={app?.status || 'DRAFT'} />
      </div>

      {/* Quick Action Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* Card 1: Application Form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📝</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: app?.academicInfo?.tenthPercentage ? 'var(--success)' : 'var(--warning)' }}>
                {app?.academicInfo?.tenthPercentage ? '✓ Details Entered' : 'Pending Info'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.35rem' }}>Application Form</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Fill in your personal, contact, academic history, and program preferences.
            </p>
          </div>
          <Link to="/student/application" className="btn btn-outline-primary btn-sm">
            {app?.status === 'DRAFT' || app?.status === 'REJECTED' ? 'Continue Form →' : 'View Form Details →'}
          </Link>
        </div>

        {/* Card 2: Document Upload */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📁</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: docs.length > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                {docs.length} Uploaded
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.35rem' }}>Document Management</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Upload required marksheets, photo, and ID cards for verification.
            </p>
          </div>
          <Link to="/student/documents" className="btn btn-outline-primary btn-sm">
            Manage Documents →
          </Link>
        </div>

        {/* Card 3: Application Fee */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💳</span>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: app?.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--danger)'
                }}
              >
                {app?.paymentStatus === 'PAID' ? '✓ ₹500 PAID' : '₹500 UNPAID'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.35rem' }}>Application Fee</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {app?.paymentStatus === 'PAID'
                ? `Paid on ${new Date(payment?.paymentDate || Date.now()).toLocaleDateString()}`
                : 'Complete the application fee payment to enable final submission.'}
            </p>
          </div>
          <Link to="/student/payment" className="btn btn-outline-primary btn-sm">
            {app?.paymentStatus === 'PAID' ? 'View Receipt →' : 'Pay Application Fee →'}
          </Link>
        </div>

        {/* Card 4: Printable Application */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🖨️</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Official PDF / Print</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.35rem' }}>Print Application</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Generate and print a formatted physical copy of your IEM admission submission.
            </p>
          </div>
          <Link to="/student/application/view" className="btn btn-secondary btn-sm">
            View & Print →
          </Link>
        </div>
      </div>

      {/* Notifications & Announcements */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Updates & Alerts</h3>
          <Link to="/student/notifications" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
            View All
          </Link>
        </div>

        {notifications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No new notifications at this time.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((n) => (
              <div
                key={n._id}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: n.isRead ? 'var(--bg-subtle)' : 'var(--primary-light)',
                  borderLeft: `4px solid ${n.isRead ? '#94a3b8' : 'var(--primary)'}`,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{n.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
