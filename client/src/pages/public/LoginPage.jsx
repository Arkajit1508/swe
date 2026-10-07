import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'admin'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@iem.edu');
    setPassword('Admin@123');
    setActiveTab('admin');
  };

  const fillDemoStudent = () => {
    setEmail('rohan.sharma@example.com');
    setPassword('Student@123');
    setActiveTab('student');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Admission Portal Login
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Institute of Engineering & Management
          </p>
        </div>

        {/* Role Tab Selector */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem',
            marginBottom: '1.5rem'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'student' ? '#ffffff' : 'transparent',
              color: activeTab === 'student' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'student' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🎓 Applicant / Student
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'admin' ? '#ffffff' : 'transparent',
              color: activeTab === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'admin' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🛡️ Admin / Faculty
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {activeTab === 'admin' ? 'Official Admin Email' : 'Registered Email Address'}
            </label>
            <input
              type="email"
              className="form-control"
              placeholder={activeTab === 'admin' ? 'admin@iem.edu' : 'student@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : `Sign In as ${activeTab === 'admin' ? 'Admin' : 'Student'}`}
          </button>
        </form>

        {/* Demo Fast Fill Buttons for Viva */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ⚡ Demo Viva Quick Credentials
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={fillDemoStudent}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              Fill Student (Rohan)
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              Fill Admin (Dean)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem' }}>
          Don't have an application account yet?{' '}
          <Link to="/register" style={{ fontWeight: '600' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
