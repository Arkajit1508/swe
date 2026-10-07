import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const ApplicationView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/me')
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading application dossier...</div>;
  }

  const app = data?.application;
  const docs = data?.documents || [];
  const payment = data?.payment;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Control Bar (hidden in print) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 className="page-title">Submitted Application Dossier</h1>
          <p className="page-subtitle">Official printable copy of your admission application</p>
        </div>
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Print / Download PDF
        </button>
      </div>

      {/* Printable Dossier Container */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          backgroundColor: '#ffffff',
          border: '2px solid var(--border-color)',
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        {/* Official Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1.5rem',
            borderBottom: '2px solid var(--primary)',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
              INSTITUTE OF ENGINEERING & MANAGEMENT
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sector V, Salt Lake, Kolkata, West Bengal - 700091 | NAAC 'A' Grade Autonomous Institute
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '0.35rem' }}>
              ADMISSION APPLICATION FORM (2026-27)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Application No:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'monospace' }}>
              {app?.applicationNumber || 'DRAFT'}
            </div>
            <div style={{ marginTop: '0.35rem' }}>
              <StatusBadge status={app?.status} />
            </div>
          </div>
        </div>

        {/* Section 1: Candidate Overview & Program */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              color: 'var(--primary)'
            }}
          >
            1. PROGRAM APPLIED FOR
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <strong>Department:</strong> {app?.courseSelection?.department || '—'}
            </div>
            <div>
              <strong>Degree / Course:</strong> {app?.courseSelection?.program || '—'}
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              color: 'var(--primary)'
            }}
          >
            2. PERSONAL INFORMATION
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div><strong>Full Name:</strong> {app?.personalInfo?.fullName || '—'}</div>
            <div><strong>Date of Birth:</strong> {app?.personalInfo?.dateOfBirth ? new Date(app.personalInfo.dateOfBirth).toLocaleDateString() : '—'}</div>
            <div><strong>Gender:</strong> {app?.personalInfo?.gender || '—'}</div>
            <div><strong>Category:</strong> {app?.personalInfo?.category || '—'}</div>
            <div><strong>Nationality:</strong> {app?.personalInfo?.nationality || 'Indian'}</div>
            <div><strong>Blood Group:</strong> {app?.personalInfo?.bloodGroup || '—'}</div>
            <div><strong>Guardian Name:</strong> {app?.personalInfo?.guardianName || '—'}</div>
            <div><strong>Guardian Contact:</strong> {app?.personalInfo?.guardianPhone || '—'}</div>
          </div>
        </div>

        {/* Section 3: Contact Details */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              color: 'var(--primary)'
            }}
          >
            3. CONTACT & RESIDENTIAL ADDRESS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div><strong>Email:</strong> {app?.contactInfo?.email || '—'}</div>
            <div><strong>Mobile Phone:</strong> {app?.contactInfo?.phone || '—'}</div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>Address:</strong> {app?.contactInfo?.addressLine || '—'}, {app?.contactInfo?.city || '—'}, {app?.contactInfo?.state || '—'} - {app?.contactInfo?.pinCode || '—'}
            </div>
          </div>
        </div>

        {/* Section 4: Academic Records */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              color: 'var(--primary)'
            }}
          >
            4. ACADEMIC QUALIFICATIONS
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <th style={{ border: '1px solid var(--border-color)', padding: '0.5rem', textAlign: 'left' }}>Standard</th>
                <th style={{ border: '1px solid var(--border-color)', padding: '0.5rem', textAlign: 'left' }}>Board / School</th>
                <th style={{ border: '1px solid var(--border-color)', padding: '0.5rem', textAlign: 'left' }}>Year</th>
                <th style={{ border: '1px solid var(--border-color)', padding: '0.5rem', textAlign: 'left' }}>Percentage / Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>Class 10 (Secondary)</td>
                <td style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>{app?.academicInfo?.tenthBoard || '—'} ({app?.academicInfo?.tenthSchool || '—'})</td>
                <td style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>{app?.academicInfo?.tenthYear || '—'}</td>
                <td style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>{app?.academicInfo?.tenthPercentage ? `${app.academicInfo.tenthPercentage}%` : '—'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>Class 12 (Higher Sec)</td>
                <td style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>{app?.academicInfo?.twelfthBoard || '—'} ({app?.academicInfo?.twelfthSchool || '—'})</td>
                <td style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>{app?.academicInfo?.twelfthYear || '—'}</td>
                <td style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>{app?.academicInfo?.twelfthPercentage ? `${app.academicInfo.twelfthPercentage}%` : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 5: Entrance Exam & Payment */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              color: 'var(--primary)'
            }}
          >
            5. ENTRANCE EXAM & APPLICATION FEE RECEIPT
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div><strong>Exam Name:</strong> {app?.examInfo?.examName || 'IEMJEE'}</div>
            <div><strong>Rank / Score:</strong> {app?.examInfo?.rankOrScore || '—'}</div>
            <div><strong>Payment Status:</strong> {app?.paymentStatus === 'PAID' ? 'PAID (₹500.00)' : 'PENDING'}</div>
            <div><strong>Transaction Reference:</strong> {payment?.transactionId || '—'}</div>
          </div>
        </div>

        {/* Section 6: Uploaded Documents */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              color: 'var(--primary)'
            }}
          >
            6. ATTACHED DOCUMENTS & VERIFICATION
          </h3>
          <ul style={{ fontSize: '0.85rem', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
            {docs.map((d) => (
              <li key={d._id}>
                <strong>{d.documentType.replace(/_/g, ' ')}:</strong> {d.originalFileName} —{' '}
                <span style={{ fontWeight: '600', color: d.verificationStatus === 'VERIFIED' ? 'var(--success)' : 'var(--warning)' }}>
                  [{d.verificationStatus}]
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Declaration & Signature Specimen */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '2rem' }}>
            <strong>Candidate Declaration:</strong> I hereby declare that all statements made in this application are true, complete, and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect at any stage, my candidature for admission to IEM will stand cancelled.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.85rem' }}>
              <div>Date: {app?.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
              <div>Place: Kolkata</div>
            </div>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ borderBottom: '1px solid #000', marginBottom: '0.25rem' }}></div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Signature of Applicant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationView;
