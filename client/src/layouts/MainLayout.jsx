import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer
        className="no-print"
        style={{
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          padding: '2.5rem 1.5rem',
          fontSize: '0.875rem',
          borderTop: '1px solid #334155'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Institute of Engineering & Management (IEM)
            </h4>
            <p style={{ maxWidth: '400px', lineHeight: 1.6 }}>
              Sector V, Salt Lake Electronics Complex, Kolkata, West Bengal 700091.
              Premier autonomous engineering & management institute.
            </p>
          </div>
          <div>
            <h5 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.5rem' }}>Quick Links</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <a href="/login" style={{ color: '#94a3b8' }}>Applicant Login</a>
              <a href="/register" style={{ color: '#94a3b8' }}>New Registration</a>
              <a href="/login" style={{ color: '#94a3b8' }}>Admin Portal</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '2rem auto 0 auto', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.8rem' }}>
          © 2026 Institute of Engineering & Management. Software Engineering Lab Full-Stack Prototype (MERN).
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
