import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const CounsellingAlloc = () => {
  const [allocations, setAllocations] = useState([]);
  const [eligibleApps, setEligibleApps] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [round, setRound] = useState(1);
  const [remarks, setRemarks] = useState('Merit Quota Allocation');
  const [allocating, setAllocating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [allocRes, appsRes, coursesRes] = await Promise.all([
        api.get('/counselling/all'),
        api.get('/admin/applications?status=APPROVED'),
        api.get('/courses')
      ]);

      if (allocRes.success) setAllocations(allocRes.allocations || []);
      if (appsRes.success) setEligibleApps(appsRes.applications || []);
      if (coursesRes.success) setCourses(coursesRes.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAllocateModal = (app) => {
    setSelectedApp(app);
    setSelectedCourse(app.courseSelection?.courseId?._id || app.courseSelection?.courseId || '');
    setModalOpen(true);
  };

  const handleAllocateSeat = async () => {
    if (!selectedApp || !selectedCourse) {
      return setMessage({ type: 'danger', text: 'Please select a valid course' });
    }

    setAllocating(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/admin/counselling/allocate', {
        applicationId: selectedApp._id,
        courseId: selectedCourse,
        round: Number(round),
        seatStatus: 'PROVISIONALLY_ALLOCATED',
        remarks
      });

      if (res.success) {
        setMessage({ type: 'success', text: `Seat in allocated successfully!` });
        setModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Seat allocation failed' });
    } finally {
      setAllocating(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading counselling records...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Counselling & Seat Allocation Cell</h1>
      <p className="page-subtitle">
        Assign departmental seats to verified and approved applicants across counselling rounds
      </p>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      {/* Eligible Candidates Table */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="section-title">
          Approved Applicants Awaiting Seat Allotment ({eligibleApps.length})
        </h3>
        {eligibleApps.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No pending approved applicants waiting for seat allocation.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>App No</th>
                  <th>Applicant</th>
                  <th>Preferred Program</th>
                  <th>12th %</th>
                  <th>Entrance Rank</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {eligibleApps.map((app) => (
                  <tr key={app._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>{app.applicationNumber}</td>
                    <td>
                      <strong>{app.personalInfo?.fullName || app.applicant?.name}</strong>
                    </td>
                    <td>{app.courseSelection?.program} ({app.courseSelection?.department})</td>
                    <td>{app.academicInfo?.twelfthPercentage}%</td>
                    <td>{app.examInfo?.rankOrScore || '—'}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>
                      <button
                        onClick={() => openAllocateModal(app)}
                        className="btn btn-primary btn-sm"
                      >
                        🏛️ Allocate Seat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Allocated Seats Table */}
      <div className="card">
        <h3 className="section-title">Confirmed Seat Allotments ({allocations.length})</h3>
        {allocations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No seat allocations generated yet.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>App No</th>
                  <th>Candidate</th>
                  <th>Allocated Program</th>
                  <th>Round</th>
                  <th>Allotment Date</th>
                  <th>Seat Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((alloc) => (
                  <tr key={alloc._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                      {alloc.applicationId?.applicationNumber}
                    </td>
                    <td>
                      <strong>{alloc.applicationId?.personalInfo?.fullName || alloc.applicantId?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alloc.applicantId?.email}</div>
                    </td>
                    <td>
                      <strong>{alloc.courseId?.programName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dept: {alloc.courseId?.department}</div>
                    </td>
                    <td>Round {alloc.round}</td>
                    <td>{new Date(alloc.allocationDate).toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge status-ALLOCATED">
                        {alloc.seatStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{alloc.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Allocate Seat Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assign Departmental Seat"
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Candidate:</span>
            <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>
              {selectedApp?.personalInfo?.fullName || selectedApp?.applicant?.name} ({selectedApp?.applicationNumber})
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Allot Program / Department <span className="required">*</span></label>
            <select
              className="form-control"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Choose Program --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.programName} ({c.availableSeats} open seats)
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Counselling Round</label>
              <select className="form-control" value={round} onChange={(e) => setRound(e.target.value)}>
                <option value={1}>Round 1 (General Merit)</option>
                <option value={2}>Round 2 (Extended Merit)</option>
                <option value={3}>Round 3 (Mop-Up Round)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Allocation Remarks</label>
              <input
                type="text"
                className="form-control"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
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
            onClick={handleAllocateSeat}
            className="btn btn-primary btn-sm"
            disabled={allocating}
          >
            {allocating ? 'Allocating...' : '✓ Confirm Seat Allotment'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CounsellingAlloc;
