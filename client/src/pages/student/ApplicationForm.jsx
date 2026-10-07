import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const ApplicationForm = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [courses, setCourses] = useState([]);
  const [appId, setAppId] = useState(null);
  const [status, setStatus] = useState('DRAFT');
  const [paymentStatus, setPaymentStatus] = useState('PENDING');

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    category: 'General',
    nationality: 'Indian',
    bloodGroup: '',
    guardianName: '',
    guardianPhone: ''
  });

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    addressLine: '',
    city: '',
    state: 'West Bengal',
    pinCode: ''
  });

  const [academicInfo, setAcademicInfo] = useState({
    tenthBoard: '',
    tenthSchool: '',
    tenthYear: 2022,
    tenthPercentage: '',
    twelfthBoard: '',
    twelfthSchool: '',
    twelfthYear: 2024,
    twelfthPercentage: '',
    stream: 'Science'
  });

  const [courseSelection, setCourseSelection] = useState({
    department: '',
    program: '',
    courseId: ''
  });

  const [examInfo, setExamInfo] = useState({
    examName: 'IEMJEE',
    rollNumber: '',
    rankOrScore: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, courseRes] = await Promise.all([
          api.get('/applications/me'),
          api.get('/courses')
        ]);

        if (courseRes.success) {
          setCourses(courseRes.courses || []);
        }

        if (appRes.success && appRes.application) {
          const a = appRes.application;
          setAppId(a._id);
          setStatus(a.status);
          setPaymentStatus(a.paymentStatus);

          if (a.personalInfo) {
            setPersonalInfo({
              fullName: a.personalInfo.fullName || '',
              dateOfBirth: a.personalInfo.dateOfBirth ? a.personalInfo.dateOfBirth.slice(0, 10) : '',
              gender: a.personalInfo.gender || 'Male',
              category: a.personalInfo.category || 'General',
              nationality: a.personalInfo.nationality || 'Indian',
              bloodGroup: a.personalInfo.bloodGroup || '',
              guardianName: a.personalInfo.guardianName || '',
              guardianPhone: a.personalInfo.guardianPhone || ''
            });
          }

          if (a.contactInfo) {
            setContactInfo({
              email: a.contactInfo.email || '',
              phone: a.contactInfo.phone || '',
              addressLine: a.contactInfo.addressLine || '',
              city: a.contactInfo.city || '',
              state: a.contactInfo.state || 'West Bengal',
              pinCode: a.contactInfo.pinCode || ''
            });
          }

          if (a.academicInfo) {
            setAcademicInfo({
              tenthBoard: a.academicInfo.tenthBoard || '',
              tenthSchool: a.academicInfo.tenthSchool || '',
              tenthYear: a.academicInfo.tenthYear || 2022,
              tenthPercentage: a.academicInfo.tenthPercentage || '',
              twelfthBoard: a.academicInfo.twelfthBoard || '',
              twelfthSchool: a.academicInfo.twelfthSchool || '',
              twelfthYear: a.academicInfo.twelfthYear || 2024,
              twelfthPercentage: a.academicInfo.twelfthPercentage || '',
              stream: a.academicInfo.stream || 'Science'
            });
          }

          if (a.courseSelection) {
            setCourseSelection({
              department: a.courseSelection.department || '',
              program: a.courseSelection.program || '',
              courseId: a.courseSelection.courseId?._id || a.courseSelection.courseId || ''
            });
          }

          if (a.examInfo) {
            setExamInfo({
              examName: a.examInfo.examName || 'IEMJEE',
              rollNumber: a.examInfo.rollNumber || '',
              rankOrScore: a.examInfo.rankOrScore || ''
            });
          }
        }
      } catch (err) {
        console.error('Failed to load application data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    const selected = courses.find((c) => c._id === selectedCourseId);
    if (selected) {
      setCourseSelection({
        courseId: selected._id,
        program: selected.degree,
        department: selected.department
      });
    } else {
      setCourseSelection({ courseId: '', program: '', department: '' });
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        personalInfo,
        contactInfo,
        academicInfo,
        courseSelection,
        examInfo
      };
      const res = await api.post('/applications/draft', payload);
      if (res.success) {
        setMessage({ type: 'success', text: 'Application draft saved successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to save draft' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!appId) return;

    if (paymentStatus !== 'PAID') {
      return setMessage({
        type: 'warning',
        text: 'Please complete the ₹500 Application Fee payment before final submission.'
      });
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // First save latest data
      await api.post('/applications/draft', {
        personalInfo,
        contactInfo,
        academicInfo,
        courseSelection,
        examInfo
      });

      // Submit
      const res = await api.post(`/applications/${appId}/submit`);
      if (res.success) {
        setStatus('SUBMITTED');
        setMessage({ type: 'success', text: 'Application submitted successfully!' });
        setTimeout(() => navigate('/student/dashboard'), 1500);
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const isReadOnly = status !== 'DRAFT' && status !== 'REJECTED';

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading application form...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">IEM Admission Application Form</h1>
          <p className="page-subtitle">Fill in all required fields accurately as per your official certificates</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusBadge status={status} />
          {!isReadOnly && (
            <button onClick={handleSaveDraft} className="btn btn-secondary btn-sm" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {isReadOnly && (
        <div className="alert alert-info">
          This application has been submitted and is currently <strong>{status}</strong>. Editing is locked.
        </div>
      )}

      {/* Multi-Section Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        {[
          { id: 1, title: '1. Personal Info' },
          { id: 2, title: '2. Contact Details' },
          { id: 3, title: '3. Academic Records' },
          { id: 4, title: '4. Program Choice' },
          { id: 5, title: '5. Entrance Exam' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              backgroundColor: activeSection === sec.id ? '#ffffff' : 'transparent',
              color: activeSection === sec.id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeSection === sec.id ? '3px solid var(--primary)' : '3px solid transparent'
            }}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* SECTION 1: Personal Information */}
      {activeSection === 1 && (
        <div className="card">
          <h3 className="section-title">Section 1: Personal Details</h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Full Candidate Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                disabled={isReadOnly}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={personalInfo.dateOfBirth}
                onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                disabled={isReadOnly}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender <span className="required">*</span></label>
              <select
                className="form-control"
                value={personalInfo.gender}
                onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                disabled={isReadOnly}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={personalInfo.category}
                onChange={(e) => setPersonalInfo({ ...personalInfo, category: e.target.value })}
                disabled={isReadOnly}
              >
                <option value="General">General / Open</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nationality</label>
              <input
                type="text"
                className="form-control"
                value={personalInfo.nationality}
                onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. O+, A+, B+"
                value={personalInfo.bloodGroup}
                onChange={(e) => setPersonalInfo({ ...personalInfo, bloodGroup: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parent / Guardian Name</label>
              <input
                type="text"
                className="form-control"
                value={personalInfo.guardianName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, guardianName: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Contact Number</label>
              <input
                type="tel"
                className="form-control"
                value={personalInfo.guardianPhone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, guardianPhone: e.target.value })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setActiveSection(2)} className="btn btn-primary btn-sm">
              Next: Contact Details →
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: Contact Information */}
      {activeSection === 2 && (
        <div className="card">
          <h3 className="section-title">Section 2: Contact & Address Information</h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Communication Email <span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Mobile Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Residential Address (House / Street / Area) <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={contactInfo.addressLine}
              onChange={(e) => setContactInfo({ ...contactInfo, addressLine: e.target.value })}
              disabled={isReadOnly}
            />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={contactInfo.city}
                onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                State <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={contactInfo.state}
                onChange={(e) => setContactInfo({ ...contactInfo, state: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                PIN Code <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={contactInfo.pinCode}
                onChange={(e) => setContactInfo({ ...contactInfo, pinCode: e.target.value })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setActiveSection(1)} className="btn btn-secondary btn-sm">
              ← Back: Personal Info
            </button>
            <button type="button" onClick={() => setActiveSection(3)} className="btn btn-primary btn-sm">
              Next: Academic Records →
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: Academic Information */}
      {activeSection === 3 && (
        <div className="card">
          <h3 className="section-title">Section 3: Academic Qualifications</h3>

          <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '1rem 0 0.75rem 0', color: 'var(--primary)' }}>
            Secondary / Class 10 Details
          </h4>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Board / Council</label>
              <input
                type="text"
                placeholder="e.g. CBSE / ICSE / State Board"
                className="form-control"
                value={academicInfo.tenthBoard}
                onChange={(e) => setAcademicInfo({ ...academicInfo, tenthBoard: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passing Year</label>
              <input
                type="number"
                className="form-control"
                value={academicInfo.tenthYear}
                onChange={(e) => setAcademicInfo({ ...academicInfo, tenthYear: Number(e.target.value) })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Percentage / CGPA <span className="required">*</span></label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 88.5"
                className="form-control"
                value={academicInfo.tenthPercentage}
                onChange={(e) => setAcademicInfo({ ...academicInfo, tenthPercentage: Number(e.target.value) })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '1.25rem 0 0.75rem 0', color: 'var(--primary)' }}>
            Higher Secondary / Class 12 / Diploma Details
          </h4>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Board / Council</label>
              <input
                type="text"
                placeholder="e.g. CBSE / ISC / WBCHSE"
                className="form-control"
                value={academicInfo.twelfthBoard}
                onChange={(e) => setAcademicInfo({ ...academicInfo, twelfthBoard: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passing Year</label>
              <input
                type="number"
                className="form-control"
                value={academicInfo.twelfthYear}
                onChange={(e) => setAcademicInfo({ ...academicInfo, twelfthYear: Number(e.target.value) })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Aggregate Percentage <span className="required">*</span></label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 85.0"
                className="form-control"
                value={academicInfo.twelfthPercentage}
                onChange={(e) => setAcademicInfo({ ...academicInfo, twelfthPercentage: Number(e.target.value) })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">10+2 Stream</label>
            <select
              className="form-control"
              value={academicInfo.stream}
              onChange={(e) => setAcademicInfo({ ...academicInfo, stream: e.target.value })}
              disabled={isReadOnly}
            >
              <option value="Science">Science (PCM / PCB)</option>
              <option value="Commerce">Commerce with Maths</option>
              <option value="Arts">Arts / Humanities</option>
              <option value="Diploma">Diploma in Engineering</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setActiveSection(2)} className="btn btn-secondary btn-sm">
              ← Back: Contact Info
            </button>
            <button type="button" onClick={() => setActiveSection(4)} className="btn btn-primary btn-sm">
              Next: Program Choice →
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: Course Selection */}
      {activeSection === 4 && (
        <div className="card">
          <h3 className="section-title">Section 4: Program Selection</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Select your preferred degree course offered at IEM Kolkata.
          </p>

          <div className="form-group">
            <label className="form-label">
              Select Desired Course / Program <span className="required">*</span>
            </label>
            <select
              className="form-control"
              value={courseSelection.courseId}
              onChange={handleCourseChange}
              disabled={isReadOnly}
            >
              <option value="">-- Choose a Degree Program --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.programName} ({c.department}) — {c.availableSeats} Seats Open
                </option>
              ))}
            </select>
          </div>

          {courseSelection.courseId && (
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '1rem'
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.35rem' }}>
                Selected Degree: {courseSelection.program}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                Department: <strong>{courseSelection.department}</strong> | Application Fee:{' '}
                <strong>₹500</strong>
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setActiveSection(3)} className="btn btn-secondary btn-sm">
              ← Back: Academic Records
            </button>
            <button type="button" onClick={() => setActiveSection(5)} className="btn btn-primary btn-sm">
              Next: Entrance Exam →
            </button>
          </div>
        </div>
      )}

      {/* SECTION 5: Entrance Exam Info & Final Submit */}
      {activeSection === 5 && (
        <div className="card">
          <h3 className="section-title">Section 5: Entrance Examination Details</h3>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Exam Name</label>
              <select
                className="form-control"
                value={examInfo.examName}
                onChange={(e) => setExamInfo({ ...examInfo, examName: e.target.value })}
                disabled={isReadOnly}
              >
                <option value="IEMJEE">IEMJEE (IEM Joint Entrance)</option>
                <option value="WBJEE">WBJEE (West Bengal JEE)</option>
                <option value="JEE Main">JEE Main (National)</option>
                <option value="JECA">JECA (For MCA)</option>
                <option value="CAT/MAT">CAT / MAT (For MBA)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Roll Number / App No</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. IEM-2026-908"
                value={examInfo.rollNumber}
                onChange={(e) => setExamInfo({ ...examInfo, rollNumber: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rank / Score</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 1420"
                value={examInfo.rankOrScore}
                onChange={(e) => setExamInfo({ ...examInfo, rankOrScore: Number(e.target.value) })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Submission Checklist
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li>Ensure all personal and contact details match your government photo ID.</li>
              <li>Academic scores must reflect your authentic board marksheets.</li>
              <li>Application fee (₹500) status must be <strong>PAID</strong> before submission.</li>
              <li>Once submitted, status moves to <strong>SUBMITTED</strong> and enters official review.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <button type="button" onClick={() => setActiveSection(4)} className="btn btn-secondary btn-sm">
              ← Back: Program Choice
            </button>

            {!isReadOnly && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={handleSaveDraft} className="btn btn-secondary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : '🚀 Submit Application'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
