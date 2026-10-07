import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let query = `?status=${statusFilter}&department=${deptFilter}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(`/admin/applications${query}`);
      if (res.success) {
        setApplications(res.applications || []);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, deptFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Admission Applications Directory</h1>
          <p className="page-subtitle">
            Search, filter, and inspect applicant dossiers across all departments ({totalCount} found)
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 2, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by candidate name, email, or application number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="DOCUMENT_VERIFICATION">Document Verification</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COUNSELLING">In Counselling</option>
              <option value="ALLOCATED">Seat Allocated</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <select
              className="form-control"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Computer Applications">Computer Applications</option>
              <option value="Management Studies">Management</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            🔍 Search
          </button>
        </form>
      </div>

      {/* Table of Applications */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Filtering application records...</div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No applications match your filter criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>App Number</th>
                  <th>Applicant Name</th>
                  <th>Contact Info</th>
                  <th>Department & Program</th>
                  <th>10th / 12th %</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>{app.applicationNumber}</td>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>
                        {app.personalInfo?.fullName || app.applicant?.name}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Category: {app.personalInfo?.category || 'General'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{app.contactInfo?.email || app.applicant?.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.contactInfo?.phone || app.applicant?.phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{app.courseSelection?.program || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.courseSelection?.department || '—'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        10th: <strong>{app.academicInfo?.tenthPercentage ? `${app.academicInfo.tenthPercentage}%` : '—'}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        12th: <strong>{app.academicInfo?.twelfthPercentage ? `${app.academicInfo.twelfthPercentage}%` : '—'}</strong>
                      </div>
                    </td>
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
                        Inspect Dossier →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
