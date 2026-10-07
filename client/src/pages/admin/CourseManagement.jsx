import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    programName: '',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 60,
    availableSeats: 60,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      if (res.success) {
        setCourses(res.courses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      programName: '',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech',
      durationYears: 4,
      totalSeats: 60,
      availableSeats: 60,
      applicationFee: 500,
      eligibility: '10+2 with PCM minimum 60% aggregate'
    });
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCourse(c);
    setFormData({
      programName: c.programName,
      department: c.department,
      degree: c.degree,
      durationYears: c.durationYears,
      totalSeats: c.totalSeats,
      availableSeats: c.availableSeats,
      applicationFee: c.applicationFee,
      eligibility: c.eligibility
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, formData);
        setMessage({ type: 'success', text: 'Program details updated successfully!' });
      } else {
        await api.post('/courses', formData);
        setMessage({ type: 'success', text: 'New program added successfully!' });
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to save course' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading academic programs...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">IEM Programs & Seat Capacity</h1>
          <p className="page-subtitle">Manage degree offerings, intake capacity, and eligibility criteria</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          + Add New Program
        </button>
      </div>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Program Name</th>
                <th>Department</th>
                <th>Degree</th>
                <th>Duration</th>
                <th>Total Seats</th>
                <th>Available Seats</th>
                <th>App Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id}>
                  <td>
                    <strong>{c.programName}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.eligibility}</div>
                  </td>
                  <td>{c.department}</td>
                  <td><span className="status-badge status-DRAFT">{c.degree}</span></td>
                  <td>{c.durationYears} Yrs</td>
                  <td><strong>{c.totalSeats}</strong></td>
                  <td>
                    <span style={{ fontWeight: '700', color: c.availableSeats > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {c.availableSeats}
                    </span>
                  </td>
                  <td>₹{c.applicationFee}</td>
                  <td>
                    <button onClick={() => openEditModal(c)} className="btn btn-secondary btn-sm">
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? 'Edit Academic Program' : 'Add New Academic Program'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Program Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. B.Tech Computer Science & Engineering"
              value={formData.programName}
              onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Department <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Computer Science & Engineering"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree</label>
              <select
                className="form-control"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              >
                <option value="B.Tech">B.Tech</option>
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
                <option value="M.Tech">M.Tech</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Duration (Years)</label>
              <input
                type="number"
                className="form-control"
                value={formData.durationYears}
                onChange={(e) => setFormData({ ...formData, durationYears: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Seats</label>
              <input
                type="number"
                className="form-control"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Seats</label>
              <input
                type="number"
                className="form-control"
                value={formData.availableSeats}
                onChange={(e) => setFormData({ ...formData, availableSeats: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Eligibility Criteria</label>
            <input
              type="text"
              className="form-control"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Saving...' : '✓ Save Program'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
