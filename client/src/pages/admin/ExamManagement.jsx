import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [score, setScore] = useState('');
  const [rank, setRank] = useState('');
  const [status, setStatus] = useState('SCHEDULED');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      if (res.success) {
        setExams(res.exams || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const openScoreModal = (exam) => {
    setSelectedExam(exam);
    setScore(exam.score !== undefined ? exam.score : '');
    setRank(exam.rank !== undefined ? exam.rank : '');
    setStatus(exam.examStatus || 'SCHEDULED');
    setModalOpen(true);
  };

  const handleSaveExamScore = async () => {
    if (!selectedExam) return;

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/admin/exams', {
        applicationId: selectedExam.applicationId?._id,
        applicantId: selectedExam.applicantId?._id,
        score: score !== '' ? Number(score) : undefined,
        rank: rank !== '' ? Number(rank) : undefined,
        examStatus: status
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Exam score and rank updated successfully!' });
        setModalOpen(false);
        fetchExams();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to update exam' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading examination roster...</div>;
  }

  return (
    <div>
      <h1 className="page-title">IEMJEE Entrance Examination Management</h1>
      <p className="page-subtitle">
        Schedule test sessions, manage admit cards, and publish scores and ranks
      </p>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="card">
        <h3 className="section-title">Candidate Examination Roster ({exams.length})</h3>
        {exams.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No exam candidates registered yet.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Admit Card No</th>
                  <th>Candidate Name</th>
                  <th>Exam Name</th>
                  <th>Exam Date</th>
                  <th>Status</th>
                  <th>Score (/200)</th>
                  <th>Merit Rank</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((ex) => (
                  <tr key={ex._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                      {ex.admitCardNumber || '—'}
                    </td>
                    <td>
                      <strong>{ex.applicantId?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ex.applicantId?.email}</div>
                    </td>
                    <td>{ex.examName}</td>
                    <td>{ex.examDate ? new Date(ex.examDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`status-badge status-${ex.examStatus === 'COMPLETED' ? 'APPROVED' : 'SUBMITTED'}`}>
                        {ex.examStatus}
                      </span>
                    </td>
                    <td><strong>{ex.score !== undefined ? ex.score : '—'}</strong></td>
                    <td><strong style={{ color: 'var(--primary)' }}>{ex.rank ? `#${ex.rank}` : '—'}</strong></td>
                    <td>
                      <button
                        onClick={() => openScoreModal(ex)}
                        className="btn btn-secondary btn-sm"
                      >
                        ✏️ Update Score
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Score Entry Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Input / Update Exam Marks & Rank"
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Candidate:</span>
            <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>
              {selectedExam?.applicantId?.name} ({selectedExam?.admitCardNumber})
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Exam Status</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ABSENT">ABSENT</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Total Score (Out of 200)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 175"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">General Merit Rank (GMR)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 142"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveExamScore}
            className="btn btn-primary btn-sm"
            disabled={saving}
          >
            {saving ? 'Saving...' : '✓ Publish Score & Rank'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ExamManagement;
