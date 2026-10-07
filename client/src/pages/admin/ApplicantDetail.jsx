import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const allowedNextTransitions = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['DOCUMENT_VERIFICATION', 'REJECTED'],
  DOCUMENT_VERIFICATION: ['APPROVED', 'REJECTED'],
  APPROVED: ['COUNSELLING'],
  COUNSELLING: ['ALLOCATED', 'REJECTED'],
  ALLOCATED: [],
  REJECTED: ['UNDER_REVIEW']
};

const ApplicantDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [docRemarks, setDocRemarks] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchApplicant = async () => {
    try {
      const res = await api.get(`/admin/applications/${id}`);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to retrieve applicant dossier' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicant();
  }, [id]);

  const handleStatusChange = async (targetStatus, reason = '') => {
    setUpdatingStatus(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put(`/admin/applications/${id}/status`, {
        status: targetStatus,
        rejectionReason: reason
      });

      if (res.success) {
        setMessage({ type: 'success', text: `Application status moved to ${targetStatus} successfully!` });
        setRejectModalOpen(false);
        setRejectionReason('');
        fetchApplicant();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Status transition failed' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleVerifyDocument = async (docId, verificationStatus) => {
    const remark = docRemarks[docId] || '';
    try {
      const res = await api.put(`/admin/documents/${docId}/verify`, {
        verificationStatus,
        remarks: remark
      });
      if (res.success) {
        setMessage({ type: 'success', text: `Document marked as ${verificationStatus}` });
        fetchApplicant();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Verification failed' });
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading applicant dossier...</div>;
  }

  const app = data?.application;
  const docs = data?.documents || [];
  const payment = data?.payment;
  const currentStatus = app?.status || 'DRAFT';
  const nextOptions = allowedNextTransitions[currentStatus] || [];

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/admin/applications" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem', display: 'inline-block' }}>
            ← Back to Applications List
          </Link>
          <h1 className="page-title">
            {app?.personalInfo?.fullName || app?.applicant?.name} — Dossier Inspector
          </h1>
          <p className="page-subtitle">
            Application No: <strong>{app?.applicationNumber}</strong> | Created:{' '}
            {new Date(app?.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusBadge status={app?.status} />
        </div>
      </div>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      {/* Rejection Alert if currently rejected */}
      {app?.status === 'REJECTED' && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <strong>Rejection Recorded:</strong> {app.rejectionReason}
        </div>
      )}

      {/* Status Transition Control Card */}
      <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary-border)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Controlled Workflow State Machine
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
          Current Status: <strong>{currentStatus}</strong>. The backend strictly validates allowed transitions to prevent invalid status jumps.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {nextOptions.length === 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No further transitions available (Final terminal state reached).
            </span>
          ) : (
            nextOptions.map((opt) => {
              if (opt === 'REJECTED') {
                return (
                  <button
                    key={opt}
                    onClick={() => setRejectModalOpen(true)}
                    className="btn btn-danger btn-sm"
                    disabled={updatingStatus}
                  >
                    ✕ Reject Application
                  </button>
                );
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleStatusChange(opt)}
                  className="btn btn-primary btn-sm"
                  disabled={updatingStatus}
                >
                  ✓ Transition to {opt.replace(/_/g, ' ')}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Grid: 2 Columns for Personal & Academic details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Personal & Contact Info */}
        <div className="card">
          <h3 className="section-title">Personal & Contact Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
            <div><strong>Candidate Name:</strong> {app?.personalInfo?.fullName || '—'}</div>
            <div><strong>Date of Birth:</strong> {app?.personalInfo?.dateOfBirth ? new Date(app.personalInfo.dateOfBirth).toLocaleDateString() : '—'}</div>
            <div><strong>Gender:</strong> {app?.personalInfo?.gender || '—'}</div>
            <div><strong>Category:</strong> {app?.personalInfo?.category || 'General'}</div>
            <div><strong>Nationality:</strong> {app?.personalInfo?.nationality || 'Indian'}</div>
            <div><strong>Blood Group:</strong> {app?.personalInfo?.bloodGroup || '—'}</div>
            <div><strong>Parent/Guardian:</strong> {app?.personalInfo?.guardianName || '—'} ({app?.personalInfo?.guardianPhone || '—'})</div>
            <div><strong>Email:</strong> {app?.contactInfo?.email || app?.applicant?.email}</div>
            <div><strong>Mobile Phone:</strong> {app?.contactInfo?.phone || app?.applicant?.phone}</div>
            <div>
              <strong>Address:</strong> {app?.contactInfo?.addressLine || '—'}, {app?.contactInfo?.city || '—'}, {app?.contactInfo?.state || '—'} - {app?.contactInfo?.pinCode || '—'}
            </div>
          </div>
        </div>

        {/* Academic & Program Info */}
        <div className="card">
          <h3 className="section-title">Academic & Entrance Record</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Chosen Program:</span>
              <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>
                {app?.courseSelection?.program || '—'} ({app?.courseSelection?.department || '—'})
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
              <strong>Class 10 (Secondary):</strong>
              <div>Board: {app?.academicInfo?.tenthBoard || '—'} | Year: {app?.academicInfo?.tenthYear || '—'}</div>
              <div>Percentage: <strong>{app?.academicInfo?.tenthPercentage ? `${app.academicInfo.tenthPercentage}%` : '—'}</strong></div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
              <strong>Class 12 (Higher Secondary):</strong>
              <div>Board: {app?.academicInfo?.twelfthBoard || '—'} | Year: {app?.academicInfo?.twelfthYear || '—'}</div>
              <div>Stream: {app?.academicInfo?.stream || 'Science'}</div>
              <div>Percentage: <strong>{app?.academicInfo?.twelfthPercentage ? `${app.academicInfo.twelfthPercentage}%` : '—'}</strong></div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
              <strong>Entrance Exam Score / Rank:</strong>
              <div>Exam: {app?.examInfo?.examName || 'IEMJEE'} | Roll: {app?.examInfo?.rollNumber || '—'}</div>
              <div>Rank/Score: <strong>{app?.examInfo?.rankOrScore || '—'}</strong></div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
              <strong>Application Fee Status:</strong>{' '}
              <span style={{ fontWeight: '700', color: app?.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--danger)' }}>
                {app?.paymentStatus} {payment ? `(Txn: ${payment.transactionId})` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents Verification Checklist */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="section-title">Submitted Documents & Verification Actions</h3>

        {docs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No documents uploaded yet by the student.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Original Filename</th>
                  <th>Verification Status</th>
                  <th>Verification Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <strong>{doc.documentType.replace(/_/g, ' ')}</strong>
                    </td>
                    <td>
                      <a
                        href={`http://localhost:5000${doc.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontWeight: '600' }}
                      >
                        👁️ {doc.originalFileName}
                      </a>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${
                          doc.verificationStatus === 'VERIFIED'
                            ? 'APPROVED'
                            : doc.verificationStatus === 'REJECTED'
                            ? 'REJECTED'
                            : 'UNDER_REVIEW'
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add remarks (e.g. blurred image)"
                        value={docRemarks[doc._id] !== undefined ? docRemarks[doc._id] : doc.remarks || ''}
                        onChange={(e) => setDocRemarks({ ...docRemarks, [doc._id]: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleVerifyDocument(doc._id, 'VERIFIED')}
                          className="btn btn-success btn-sm"
                          title="Mark Document Verified"
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => handleVerifyDocument(doc._id, 'REJECTED')}
                          className="btn btn-danger btn-sm"
                          title="Mark Document Rejected"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Application Form"
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Please state the official reason for rejecting this admission application. This explanation will be displayed to the student on their dashboard so they can correct their submission.
          </p>

          <div className="form-group">
            <label className="form-label">
              Official Rejection Reason <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="e.g. 12th marksheet is illegible. Aggregate PCM score falls below the required 60% threshold."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setRejectModalOpen(false)}
            className="btn btn-secondary btn-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange('REJECTED', rejectionReason)}
            className="btn btn-danger btn-sm"
            disabled={!rejectionReason.trim() || updatingStatus}
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicantDetail;
