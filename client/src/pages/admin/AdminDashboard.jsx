import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => setError('Failed to load admin analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Aggregating admin analytics from MongoDB...</div>;
  }

  const summary = data?.summary || {};
  const statusDist = data?.statusDistribution || {};
  const deptDist = data?.departmentDistribution || [];
  const recentApps = data?.recentApplications || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">IEM Admissions Administration Dashboard</h1>
          <p className="page-subtitle">
            Real-time pipeline analytics aggregated directly from MongoDB ($match & $group)
          </p>
        </div>
        <Link to="/admin/applications" className="btn btn-primary btn-sm">
          📑 View All Applications →
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* Card 1: Total */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Applications
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.25rem' }}>
            {summary.totalApplications || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {summary.totalStudents || 0} Registered Applicants
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Under Review / Pending
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--warning)', marginTop: '0.25rem' }}>
            {summary.pendingApplications || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Awaiting Verification & Approval
          </div>
        </div>

        {/* Card 3: Approved / Allocated */}
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Approved / In Counselling
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--success)', marginTop: '0.25rem' }}>
            {summary.approvedApplications || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Verified & Qualified Candidates
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="card" style={{ borderLeft: '4px solid var(--purple)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Application Fees Collected
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--purple)', marginTop: '0.25rem' }}>
            ₹{(summary.totalRevenue || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {summary.totalTransactions || 0} Paid Submissions
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Department-wise Distribution */}
        <div className="card">
          <h3 className="section-title">Applications by Department (Aggregation)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {deptDist.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No department data yet.</p>
            ) : (
              deptDist.map((item) => (
                <div key={item._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600' }}>{item._id}</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.count} apps</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: 'var(--primary)',
                        width: `${Math.min(100, (item.count / (summary.totalApplications || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Distribution Breakdown */}
        <div className="card">
          <h3 className="section-title">Applications by Workflow Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {Object.entries(statusDist).map(([st, cnt]) => (
              <div
                key={st}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <StatusBadge status={st} />
                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{cnt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Applicant Submissions</h3>
          <Link to="/admin/applications" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
            View Full Table →
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>App Number</th>
                <th>Applicant Name</th>
                <th>Department</th>
                <th>Program</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Fee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.map((app) => (
                <tr key={app._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>{app.applicationNumber}</td>
                  <td>
                    <strong>{app.personalInfo?.fullName || app.applicant?.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.applicant?.email}</div>
                  </td>
                  <td>{app.courseSelection?.department || '—'}</td>
                  <td>{app.courseSelection?.program || '—'}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge status={app.status} />
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: app.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {app.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/applications/${app._id}`} className="btn btn-primary btn-sm">
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
