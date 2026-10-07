import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, isAdmin } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/student/application', icon: '📝', label: 'Application Form' },
    { to: '/student/documents', icon: '📁', label: 'Document Upload' },
    { to: '/student/payment', icon: '💳', label: 'Fee Payment' },
    { to: '/student/application/view', icon: '🖨️', label: 'Print Application' },
    { to: '/student/exam', icon: '🎓', label: 'Entrance Exam' },
    { to: '/student/counselling', icon: '🏛️', label: 'Seat Allocation' },
    { to: '/student/notifications', icon: '🔔', label: 'Notifications' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: '📈', label: 'Dashboard Overview' },
    { to: '/admin/applications', icon: '📑', label: 'All Applications' },
    { to: '/admin/counselling', icon: '🏛️', label: 'Seat Counselling' },
    { to: '/admin/exams', icon: '🎓', label: 'Exam Management' },
    { to: '/admin/courses', icon: '📚', label: 'Programs & Seats' }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside
      className="sidebar no-print"
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 0.75rem',
        minHeight: 'calc(100vh - 64px)'
      }}
    >
      <div>
        <div style={{ padding: '0 0.75rem 1rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            {isAdmin ? 'Administration Portal' : 'Applicant Portal'}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.25rem' }}>
            {user?.name || 'User'}
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              })}
            >
              <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        style={{
          padding: '0.85rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}
      >
        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>IEM Admission Desk</div>
        <div>Helpdesk: 033-2357-2059</div>
        <div>admissions@iem.edu.in</div>
      </div>
    </aside>
  );
};

export default Sidebar;
