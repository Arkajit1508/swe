import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CounsellingPage = () => {
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/counselling/me')
      .then((res) => {
        if (res.success) setAllocation(res.allocation);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading seat allocation status...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Counselling & Seat Allocation</h1>
      <p className="page-subtitle">
        Provisional branch allotment and seat confirmation letter for IEM Kolkata
      </p>

      {allocation ? (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', border: '2px solid var(--success-border)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}
          >
            <div>
              <span className="status-badge status-ALLOCATED" style={{ marginBottom: '0.5rem' }}>
                ✓ {allocation.seatStatus}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                Provisional Seat Allotment Letter
              </h2>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div>Round: <strong>Round {allocation.round}</strong></div>
              <div>Allotment Date: {new Date(allocation.allocationDate).toLocaleDateString()}</div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--success-light)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)', marginBottom: '0.35rem' }}>
              Allocated Academic Program:
            </h3>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {allocation.courseId?.programName}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Department of {allocation.courseId?.department} | Duration: {allocation.courseId?.durationYears} Years
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Reporting Deadline:</span>
              <div style={{ fontWeight: '700', color: 'var(--danger)' }}>
                {allocation.reportingDeadline
                  ? new Date(allocation.reportingDeadline).toLocaleDateString()
                  : 'Within 7 working days'}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Reporting Campus:</span>
              <div style={{ fontWeight: '600' }}>IEM Management House / Gurukul Campus, Salt Lake</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)' }}>Allotment Remarks:</span>
              <div style={{ fontWeight: '500' }}>{allocation.remarks || 'Seat provisionally allocated based on merit.'}</div>
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong>Next Steps:</strong> Please report to the IEM Admission Office with all original documents, 4 passport photos, and this allotment letter to confirm your final registration.
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Counselling & Allotment Pending
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Your application is undergoing document verification and merit evaluation. Once the admissions committee schedules your counselling round, your allocated branch and seat letter will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default CounsellingPage;
