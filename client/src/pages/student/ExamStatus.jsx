import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ExamStatus = () => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exams/me')
      .then((res) => {
        if (res.success) setExam(res.exam);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading entrance exam details...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Entrance Examination Portal</h1>
      <p className="page-subtitle">
        IEM Joint Entrance Examination (IEMJEE 2026) Schedule & Score Card
      </p>

      {exam ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Admit Card / Exam Schedule */}
          <div className="card">
            <h3 className="section-title">Exam Schedule & Hall Ticket</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Exam Name:</span>
                <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>
                  {exam.examName}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Admit Card / Roll No:</span>
                <div style={{ fontWeight: '700', fontFamily: 'monospace' }}>
                  {exam.admitCardNumber || 'IEMJEE-2026-PENDING'}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Scheduled Date & Slot:</span>
                <div style={{ fontWeight: '600' }}>
                  {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'To be announced'} (10:00 AM - 12:00 PM)
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Exam Venue / Mode:</span>
                <div style={{ fontWeight: '600' }}>{exam.examVenue}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <div>
                  <span className={`status-badge status-${exam.examStatus === 'COMPLETED' ? 'APPROVED' : 'SUBMITTED'}`}>
                    {exam.examStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Result & Score Card */}
          <div className="card">
            <h3 className="section-title">Entrance Test Result & Merit Rank</h3>
            {exam.examStatus === 'COMPLETED' || exam.score !== undefined ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div
                  style={{
                    backgroundColor: 'var(--success-light)',
                    border: '1px solid var(--success-border)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '700' }}>
                    GENERAL MERIT RANK (GMR)
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)' }}>
                    #{exam.rank || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                    Total Score: <strong>{exam.score} / 200 Marks</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Based on your entrance exam merit rank, you are eligible to participate in the departmental seat allotment counselling rounds.
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>
                  Results Awaited
                </h4>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Your entrance exam results and merit rank will be published here after test completion.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Please submit your admission application form to generate your entrance examination schedule.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExamStatus;
