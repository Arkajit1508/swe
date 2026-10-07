import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading notifications...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Admission Alerts & Notifications</h1>
          <p className="page-subtitle">Track real-time system alerts regarding your admission lifecycle</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button onClick={handleMarkAll} className="btn btn-secondary btn-sm">
            ✓ Mark All as Read
          </button>
        )}
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            No notifications to display.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {notifications.map((n) => (
              <div
                key={n._id}
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: n.isRead ? 'var(--bg-subtle)' : 'var(--primary-light)',
                  borderLeft: `4px solid ${
                    n.type === 'SUCCESS'
                      ? 'var(--success)'
                      : n.type === 'WARNING'
                      ? 'var(--danger)'
                      : n.type === 'ACTION_REQUIRED'
                      ? 'var(--purple)'
                      : 'var(--primary)'
                  }`,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{n.title}</strong>
                    {!n.isRead && (
                      <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary)', color: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.35rem', display: 'inline-block' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
