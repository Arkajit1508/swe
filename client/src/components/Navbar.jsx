import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import IEMLogo from './IEMLogo';
import api from '../services/api';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/notifications')
        .then(data => {
          if (data.success) setUnreadCount(data.unreadCount || 0);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="no-print"
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            ☰
          </button>
        )}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <IEMLogo size="sm" />
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
              IEM Admissions
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Institute of Engineering & Management
            </div>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {user ? (
          <>
            <Link
              to={isAdmin ? '/admin/dashboard' : '/student/notifications'}
              style={{
                position: 'relative',
                textDecoration: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.25rem',
                padding: '0.25rem'
              }}
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    borderRadius: '50%',
                    padding: '0.1rem 0.35rem'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isAdmin ? 'var(--purple-light)' : 'var(--primary-light)',
                  color: isAdmin ? 'var(--purple)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  border: `1px solid ${isAdmin ? 'var(--purple-border)' : 'var(--primary-border)'}`
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ display: 'none', flexDirection: 'column' }} className="user-text-info">
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role} Portal
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Sign Out">
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Apply Now
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
