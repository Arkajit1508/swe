import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

// Helper to parse blood group string (e.g. 'O+', 'AB-', 'A') into alphabet & Rh sign
const parseBloodGroup = (bg = '') => {
  const clean = String(bg).trim().toUpperCase();
  let rh = '';
  let letter = '';

  if (clean.endsWith('+')) {
    rh = '+';
    letter = clean.slice(0, -1);
  } else if (clean.endsWith('-')) {
    rh = '-';
    letter = clean.slice(0, -1);
  } else if (clean === '+' || clean === '-') {
    rh = clean;
    letter = '';
  } else {
    letter = clean;
  }

  return { letter, rh };
};

const ApplicationForm = () => {
  const { user } = useAuth();
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

  const handleBloodLetterChange = (newLetter) => {
    const { rh } = parseBloodGroup(personalInfo.bloodGroup);
    const combined = newLetter && rh ? `${newLetter}${rh}` : (newLetter || rh);
    setPersonalInfo(prev => ({ ...prev, bloodGroup: combined }));
  };

  const handleBloodRhChange = (newRh) => {
    const { letter } = parseBloodGroup(personalInfo.bloodGroup);
    const combined = letter && newRh ? `${letter}${newRh}` : (letter || newRh);
    setPersonalInfo(prev => ({ ...prev, bloodGroup: combined }));
  };

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

        const registeredDob = user?.dateOfBirth 
          ? String(user.dateOfBirth).slice(0, 10) 
          : localStorage.getItem('iem_registered_dob') || '';

        if (appRes.success && appRes.application) {
          const a = appRes.application;
          setAppId(a._id);
          setStatus(a.status);
          setPaymentStatus(a.paymentStatus);

          if (a.personalInfo) {
            setPersonalInfo({
              fullName: a.personalInfo.fullName || user?.name || '',
              dateOfBirth: a.personalInfo.dateOfBirth ? a.personalInfo.dateOfBirth.slice(0, 10) : registeredDob,
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
              email: a.contactInfo.email || user?.email || '',
              phone: a.contactInfo.phone || user?.phone || '',
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
        } else {
          // Pre-populate directly from registered user profile
          if (user || registeredDob) {
            setPersonalInfo(prev => ({
              ...prev,
              fullName: prev.fullName || user?.name || '',
              dateOfBirth: prev.dateOfBirth || registeredDob
            }));
            setContactInfo(prev => ({
              ...prev,
              email: prev.email || user?.email || '',
              phone: prev.phone || user?.phone || ''
            }));
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

  const handleGoToSection = (targetSection) => {
    // If moving forward from Section 1:
    if (activeSection === 1 && targetSection > 1) {
      if (personalInfo.fullName && /\d/.test(personalInfo.fullName)) {
        return setMessage({ type: 'danger', text: 'Candidate Name cannot contain numbers. Please use letters only.' });
      }
      if (personalInfo.guardianName && /\d/.test(personalInfo.guardianName)) {
        return setMessage({ type: 'danger', text: 'Parent / Guardian Name cannot contain numbers. Please use letters only.' });
      }
      if (personalInfo.guardianPhone && personalInfo.guardianPhone.length < 10) {
        return setMessage({
          type: 'danger',
          text: `Guardian Contact Number is incomplete (${personalInfo.guardianPhone.length}/10 digits). Please enter a valid 10-digit mobile number or leave blank.`
        });
      }
    }

    // If moving forward from Section 2:
    if (activeSection === 2 && targetSection > 2) {
      if (contactInfo.phone && contactInfo.phone.length < 10) {
        return setMessage({
          type: 'danger',
          text: `Mobile Number is incomplete (${contactInfo.phone.length}/10 digits). Please enter a valid 10-digit mobile number.`
        });
      }
      if (contactInfo.pinCode && contactInfo.pinCode.length < 6) {
        return setMessage({
          type: 'danger',
          text: `PIN Code is incomplete (${contactInfo.pinCode.length}/6 digits). Please enter a valid 6-digit PIN code.`
        });
      }
    }

    // If moving forward from Section 3:
    if (activeSection === 3 && targetSection > 3) {
      if (academicInfo.tenthYear) {
        const tenthYear = Number(academicInfo.tenthYear);
        if (tenthYear < 2018 || tenthYear > 2024) {
          return setMessage({ type: 'danger', text: 'Class 10 passing year must be between 2018 and 2024 (Class 12 requires at least 2 years and must be completed by 2026).' });
        }
      }
      if (academicInfo.twelfthYear) {
        const twelfthYear = Number(academicInfo.twelfthYear);
        if (twelfthYear < 2018 || twelfthYear > 2026) {
          return setMessage({ type: 'danger', text: 'Class 12 passing year must be between 2018 and 2026.' });
        }
      }
      if (academicInfo.tenthYear && academicInfo.twelfthYear) {
        const tenthYear = Number(academicInfo.tenthYear);
        const twelfthYear = Number(academicInfo.twelfthYear);
        if (twelfthYear <= tenthYear) {
          return setMessage({
            type: 'danger',
            text: `Class 12 passing year cannot be less than or equal to Class 10 (Madhyamik) passing year (${tenthYear}).`
          });
        }
        if (twelfthYear < tenthYear + 2 || twelfthYear > tenthYear + 4) {
          return setMessage({
            type: 'danger',
            text: `Class 12 passing year must be between +2 and +4 years of Class 10 passing year (${tenthYear + 2} – ${Math.min(2026, tenthYear + 4)}).`
          });
        }
      }
      if (academicInfo.tenthPercentage !== undefined && academicInfo.tenthPercentage !== '') {
        const p10 = Number(academicInfo.tenthPercentage);
        if (isNaN(p10) || p10 < 0 || p10 > 100) {
          return setMessage({ type: 'danger', text: 'Class 10 percentage cannot exceed 100.00% and must be between 0.00% and 100.00%.' });
        }
      }
      if (academicInfo.twelfthPercentage !== undefined && academicInfo.twelfthPercentage !== '') {
        const p12 = Number(academicInfo.twelfthPercentage);
        if (isNaN(p12) || p12 < 0 || p12 > 100) {
          return setMessage({ type: 'danger', text: 'Class 12 aggregate percentage cannot exceed 100.00% and must be between 0.00% and 100.00%.' });
        }
      }
    }

    setMessage({ type: '', text: '' });
    setActiveSection(targetSection);
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

    if (personalInfo.fullName && /\d/.test(personalInfo.fullName)) {
      return setMessage({ type: 'danger', text: 'Candidate Name cannot contain numbers. Please use letters only.' });
    }
    if (personalInfo.guardianName && /\d/.test(personalInfo.guardianName)) {
      return setMessage({ type: 'danger', text: 'Parent / Guardian Name cannot contain numbers. Please use letters only.' });
    }
    if (personalInfo.guardianPhone && personalInfo.guardianPhone.length < 10) {
      return setMessage({ type: 'danger', text: 'Guardian Contact Number must be a valid 10-digit mobile number.' });
    }
    if (!contactInfo.phone || contactInfo.phone.length < 10) {
      return setMessage({ type: 'danger', text: 'Candidate Mobile Number must be a valid 10-digit mobile number.' });
    }
    if (!contactInfo.pinCode || contactInfo.pinCode.length < 6) {
      return setMessage({ type: 'danger', text: 'PIN Code must be a valid 6-digit postal PIN code.' });
    }

    if (academicInfo.tenthYear) {
      const tenthYear = Number(academicInfo.tenthYear);
      if (tenthYear < 2018 || tenthYear > 2024) {
        return setMessage({ type: 'danger', text: 'Class 10 passing year must be between 2018 and 2024 (Class 12 requires at least 2 years and must be completed by 2026).' });
      }
    }
    if (academicInfo.twelfthYear) {
      const twelfthYear = Number(academicInfo.twelfthYear);
      if (twelfthYear < 2018 || twelfthYear > 2026) {
        return setMessage({ type: 'danger', text: 'Class 12 passing year must be between 2018 and 2026.' });
      }
    }
    if (academicInfo.tenthYear && academicInfo.twelfthYear) {
      const tenthYear = Number(academicInfo.tenthYear);
      const twelfthYear = Number(academicInfo.twelfthYear);
      if (twelfthYear <= tenthYear) {
        return setMessage({
          type: 'danger',
          text: `Class 12 passing year cannot be less than or equal to Class 10 (Madhyamik) passing year (${tenthYear}).`
        });
      }
      if (twelfthYear < tenthYear + 2 || twelfthYear > tenthYear + 4) {
        return setMessage({
          type: 'danger',
          text: `Class 12 passing year must be between +2 and +4 years of Class 10 passing year (${tenthYear + 2} – ${Math.min(2026, tenthYear + 4)}).`
        });
      }
    }
    if (academicInfo.tenthPercentage !== undefined && academicInfo.tenthPercentage !== '') {
      const p10 = Number(academicInfo.tenthPercentage);
      if (isNaN(p10) || p10 < 0 || p10 > 100) {
        return setMessage({ type: 'danger', text: 'Class 10 percentage cannot exceed 100.00% and must be between 0.00% and 100.00%.' });
      }
    }
    if (academicInfo.twelfthPercentage !== undefined && academicInfo.twelfthPercentage !== '') {
      const p12 = Number(academicInfo.twelfthPercentage);
      if (isNaN(p12) || p12 < 0 || p12 > 100) {
        return setMessage({ type: 'danger', text: 'Class 12 aggregate percentage cannot exceed 100.00% and must be between 0.00% and 100.00%.' });
      }
    }
    if (examInfo.rankOrScore && Number(examInfo.rankOrScore) < 1) {
      return setMessage({ type: 'danger', text: 'Entrance Exam rank must be a positive integer (min: 1).' });
    }

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
            onClick={() => handleGoToSection(sec.id)}
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
                placeholder="Candidate Full Name (Letters only)"
                className="form-control"
                value={personalInfo.fullName}
                onKeyDown={(e) => {
                  if (/[0-9]/.test(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
                  setPersonalInfo({ ...personalInfo, fullName: clean });
                }}
                disabled={isReadOnly}
                required
              />
              <small style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                Letters and spaces only (numbers not permitted)
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                min="1960-01-01"
                max="2011-12-31"
                value={personalInfo.dateOfBirth}
                onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                disabled={isReadOnly}
                required
              />
              <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Applicant must be between 15 and 65 years old (born 1960 – 2011)
              </small>
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
              <select
                className="form-control"
                value={personalInfo.nationality || 'Indian'}
                onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                disabled={isReadOnly}
              >
                <option value="Indian">Indian</option>
                <option value="NRI / Non-Resident Indian">NRI / Non-Resident Indian</option>
                <option value="OCI / PIO Cardholder">OCI / PIO Cardholder</option>
                <option value="International / Foreign National">International / Foreign National</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label 
                    htmlFor="blood-alphabet" 
                    style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', display: 'block', fontWeight: 500 }}
                  >
                    Alphabet
                  </label>
                  <select
                    id="blood-alphabet"
                    className="form-control"
                    value={parseBloodGroup(personalInfo.bloodGroup).letter}
                    onChange={(e) => handleBloodLetterChange(e.target.value)}
                    disabled={isReadOnly}
                    aria-label="Blood Group Alphabet"
                  >
                    <option value="">Select Alphabet</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div>
                  <label 
                    htmlFor="blood-rh" 
                    style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', display: 'block', fontWeight: 500 }}
                  >
                    Rh Factor (+ / -)
                  </label>
                  <select
                    id="blood-rh"
                    className="form-control"
                    value={parseBloodGroup(personalInfo.bloodGroup).rh}
                    onChange={(e) => handleBloodRhChange(e.target.value)}
                    disabled={isReadOnly}
                    aria-label="Rh Factor"
                  >
                    <option value="">Select Rh</option>
                    <option value="+">+ (Positive)</option>
                    <option value="-">- (Negative)</option>
                  </select>
                </div>
              </div>
              {personalInfo.bloodGroup && (
                <small style={{ color: '#0284c7', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block', fontWeight: 500 }}>
                  Selected Blood Group: <strong>{personalInfo.bloodGroup}</strong>
                </small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Parent / Guardian Name</label>
              <input
                type="text"
                placeholder="e.g. Subir Bhattacharya"
                className="form-control"
                value={personalInfo.guardianName}
                onKeyDown={(e) => {
                  if (/[0-9]/.test(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
                  setPersonalInfo({ ...personalInfo, guardianName: clean });
                }}
                disabled={isReadOnly}
              />
              <small style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                Letters and spaces only (numbers not permitted)
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Contact Number</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
                className="form-control"
                style={{
                  borderColor:
                    personalInfo.guardianPhone && personalInfo.guardianPhone.length < 10
                      ? '#ef4444'
                      : undefined
                }}
                value={personalInfo.guardianPhone}
                onKeyDown={(e) => {
                  if (['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
                  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPersonalInfo({ ...personalInfo, guardianPhone: digits });
                }}
                disabled={isReadOnly}
              />
              {personalInfo.guardianPhone && personalInfo.guardianPhone.length < 10 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Incomplete mobile number: requires 10 digits (currently {personalInfo.guardianPhone.length}/10 digits)
                </small>
              )}
              {personalInfo.guardianPhone && personalInfo.guardianPhone.length === 10 && (
                <small style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ✓ Valid 10-digit mobile number
                </small>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => handleGoToSection(2)} className="btn btn-primary btn-sm">
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
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
                className="form-control"
                style={{
                  borderColor: contactInfo.phone && contactInfo.phone.length < 10 ? '#ef4444' : undefined
                }}
                value={contactInfo.phone}
                onKeyDown={(e) => {
                  if (['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
                  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setContactInfo({ ...contactInfo, phone: digits });
                }}
                disabled={isReadOnly}
                required
              />
              {contactInfo.phone && contactInfo.phone.length < 10 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Incomplete mobile number: requires 10 digits (currently {contactInfo.phone.length}/10 digits)
                </small>
              )}
              {contactInfo.phone && contactInfo.phone.length === 10 && (
                <small style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ✓ Valid 10-digit mobile number
                </small>
              )}
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
                placeholder="e.g. Kolkata"
                className="form-control"
                value={contactInfo.city}
                onKeyDown={(e) => {
                  if (/[0-9]/.test(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^a-zA-Z\s.-]/g, '');
                  setContactInfo({ ...contactInfo, city: clean });
                }}
                disabled={isReadOnly}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                State <span className="required">*</span>
              </label>
              <select
                className="form-control"
                value={contactInfo.state || 'West Bengal'}
                onChange={(e) => setContactInfo({ ...contactInfo, state: e.target.value })}
                disabled={isReadOnly}
                required
              >
                <option value="">-- Select State / UT --</option>
                {[
                  'West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam',
                  'Sikkim', 'Tripura', 'Meghalaya', 'Delhi NCR', 'Uttar Pradesh',
                  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh',
                  'Kerala', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Punjab',
                  'Haryana', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir',
                  'Goa', 'Chhattisgarh', 'Other State / UT'
                ].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                PIN Code <span className="required">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="6-digit PIN (e.g. 700091)"
                className="form-control"
                style={{
                  borderColor: contactInfo.pinCode && contactInfo.pinCode.length < 6 ? '#ef4444' : undefined
                }}
                value={contactInfo.pinCode}
                onKeyDown={(e) => {
                  if (['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
                  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setContactInfo({ ...contactInfo, pinCode: digits });
                }}
                disabled={isReadOnly}
                required
              />
              {contactInfo.pinCode && contactInfo.pinCode.length < 6 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Incomplete PIN code: requires 6 digits (currently {contactInfo.pinCode.length}/6 digits)
                </small>
              )}
              {contactInfo.pinCode && contactInfo.pinCode.length === 6 && (
                <small style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ✓ Valid 6-digit PIN code
                </small>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setActiveSection(1)} className="btn btn-secondary btn-sm">
              ← Back: Personal Info
            </button>
            <button type="button" onClick={() => handleGoToSection(3)} className="btn btn-primary btn-sm">
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
              <label className="form-label">Board / Council <span className="required">*</span></label>
              <select
                className="form-control"
                value={academicInfo.tenthBoard}
                onChange={(e) => setAcademicInfo({ ...academicInfo, tenthBoard: e.target.value })}
                disabled={isReadOnly}
              >
                <option value="">-- Select 10th Board --</option>
                <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                <option value="ICSE">ICSE / CISCE</option>
                <option value="WBBSE">WBBSE (West Bengal Board)</option>
                <option value="BSEB">BSEB (Bihar Board)</option>
                <option value="JAC">JAC (Jharkhand Board)</option>
                <option value="Other State Board">Other State Board</option>
                <option value="NIOS">NIOS (Open Schooling)</option>
                <option value="Other">Other Board</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Passing Year <span className="required">*</span></label>
              <input
                type="number"
                step="1"
                min="2018"
                max="2024"
                placeholder="e.g. 2022 (2018 – 2024)"
                className="form-control"
                style={{
                  borderColor:
                    (academicInfo.tenthYear && (Number(academicInfo.tenthYear) < 2018 || Number(academicInfo.tenthYear) > 2024))
                      ? '#ef4444'
                      : undefined
                }}
                value={academicInfo.tenthYear ?? ''}
                onKeyDown={(e) => {
                  if (['.', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setAcademicInfo(prev => ({
                    ...prev,
                    tenthYear: digits ? parseInt(digits, 10) : ''
                  }));
                }}
                disabled={isReadOnly}
              />
              {academicInfo.tenthYear && Number(academicInfo.tenthYear) > 2024 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Cannot exceed 2024 (Class 12 must be completed by 2026)
                </small>
              )}
              {academicInfo.tenthYear && Number(academicInfo.tenthYear) < 2018 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Must be 2018 or later (minimum: 2018)
                </small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Percentage <span className="required">*</span></label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 88.50"
                className="form-control"
                style={{
                  borderColor:
                    (academicInfo.tenthPercentage !== undefined && academicInfo.tenthPercentage !== '' && (Number(academicInfo.tenthPercentage) < 0 || Number(academicInfo.tenthPercentage) > 100))
                      ? '#ef4444'
                      : undefined
                }}
                value={academicInfo.tenthPercentage}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  setAcademicInfo({ ...academicInfo, tenthPercentage: e.target.value });
                }}
                disabled={isReadOnly}
              />
              {academicInfo.tenthPercentage !== undefined && academicInfo.tenthPercentage !== '' && Number(academicInfo.tenthPercentage) > 100 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Percentage cannot exceed 100.00% (entered: {academicInfo.tenthPercentage}%)
                </small>
              )}
              {academicInfo.tenthPercentage !== undefined && academicInfo.tenthPercentage !== '' && Number(academicInfo.tenthPercentage) < 0 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Percentage cannot be less than 0.00%
                </small>
              )}
              {!(academicInfo.tenthPercentage !== undefined && academicInfo.tenthPercentage !== '' && (Number(academicInfo.tenthPercentage) < 0 || Number(academicInfo.tenthPercentage) > 100)) && (
                <small style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                  Score range (0.00% – 100.00%)
                </small>
              )}
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '1.25rem 0 0.75rem 0', color: 'var(--primary)' }}>
            Higher Secondary / Class 12 Details
          </h4>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Board / Council <span className="required">*</span></label>
              <select
                className="form-control"
                value={academicInfo.twelfthBoard}
                onChange={(e) => setAcademicInfo({ ...academicInfo, twelfthBoard: e.target.value })}
                disabled={isReadOnly}
              >
                <option value="">-- Select 12th Board --</option>
                <option value="CBSE">CBSE (Class XII)</option>
                <option value="ISC">ISC (Class XII - CISCE)</option>
                <option value="WBCHSE">WBCHSE (West Bengal Council)</option>
                <option value="BSEB">BSEB (Bihar Intermediate)</option>
                <option value="JAC">JAC (Jharkhand Board)</option>
                <option value="WBSCTE">WBSCTE (State Council / Diploma)</option>
                <option value="Other State Board">Other State Board</option>
                <option value="NIOS">NIOS (Senior Secondary)</option>
                <option value="Other">Other Board</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Passing Year <span className="required">*</span></label>
              <input
                type="number"
                step="1"
                min={academicInfo.tenthYear ? String(Number(academicInfo.tenthYear) + 2) : "2018"}
                max={academicInfo.tenthYear ? String(Math.min(2026, Number(academicInfo.tenthYear) + 4)) : "2026"}
                placeholder={academicInfo.tenthYear ? `e.g. ${Number(academicInfo.tenthYear) + 2} (${Number(academicInfo.tenthYear) + 2}–${Math.min(2026, Number(academicInfo.tenthYear) + 4)})` : "e.g. 2024 (2018 – 2026)"}
                className="form-control"
                style={{
                  borderColor:
                    (academicInfo.twelfthYear && (Number(academicInfo.twelfthYear) < 2018 || Number(academicInfo.twelfthYear) > 2026)) ||
                    (academicInfo.tenthYear && academicInfo.twelfthYear && (Number(academicInfo.twelfthYear) <= Number(academicInfo.tenthYear) || Number(academicInfo.twelfthYear) < Number(academicInfo.tenthYear) + 2 || Number(academicInfo.twelfthYear) > Number(academicInfo.tenthYear) + 4))
                      ? '#ef4444'
                      : undefined
                }}
                value={academicInfo.twelfthYear ?? ''}
                onKeyDown={(e) => {
                  if (['.', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setAcademicInfo(prev => ({
                    ...prev,
                    twelfthYear: digits ? parseInt(digits, 10) : ''
                  }));
                }}
                disabled={isReadOnly}
              />
              {academicInfo.tenthYear && academicInfo.twelfthYear && Number(academicInfo.twelfthYear) <= Number(academicInfo.tenthYear) && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Class 12 passing year cannot be less than or equal to Class 10 (Madhyamik) passing year ({academicInfo.tenthYear})
                </small>
              )}
              {academicInfo.tenthYear && academicInfo.twelfthYear && Number(academicInfo.twelfthYear) > Number(academicInfo.tenthYear) && Number(academicInfo.twelfthYear) < Number(academicInfo.tenthYear) + 2 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Class 12 requires at least 2 years after Class 10 (minimum: {Number(academicInfo.tenthYear) + 2})
                </small>
              )}
              {academicInfo.tenthYear && academicInfo.twelfthYear && Number(academicInfo.twelfthYear) > Number(academicInfo.tenthYear) + 4 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Class 12 passing year cannot exceed +4 years from Class 10 (maximum: {Math.min(2026, Number(academicInfo.tenthYear) + 4)})
                </small>
              )}
              {academicInfo.twelfthYear && Number(academicInfo.twelfthYear) > 2026 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Cannot be in the future (maximum allowed: 2026)
                </small>
              )}
              {academicInfo.twelfthYear && Number(academicInfo.twelfthYear) < 2018 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Must be 2018 or later (minimum: 2018)
                </small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Aggregate Percentage <span className="required">*</span></label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 85.00"
                className="form-control"
                style={{
                  borderColor:
                    (academicInfo.twelfthPercentage !== undefined && academicInfo.twelfthPercentage !== '' && (Number(academicInfo.twelfthPercentage) < 0 || Number(academicInfo.twelfthPercentage) > 100))
                      ? '#ef4444'
                      : undefined
                }}
                value={academicInfo.twelfthPercentage}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  setAcademicInfo({ ...academicInfo, twelfthPercentage: e.target.value });
                }}
                disabled={isReadOnly}
              />
              {academicInfo.twelfthPercentage !== undefined && academicInfo.twelfthPercentage !== '' && Number(academicInfo.twelfthPercentage) > 100 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Percentage cannot exceed 100.00% (entered: {academicInfo.twelfthPercentage}%)
                </small>
              )}
              {academicInfo.twelfthPercentage !== undefined && academicInfo.twelfthPercentage !== '' && Number(academicInfo.twelfthPercentage) < 0 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Percentage cannot be less than 0.00%
                </small>
              )}
              {!(academicInfo.twelfthPercentage !== undefined && academicInfo.twelfthPercentage !== '' && (Number(academicInfo.twelfthPercentage) < 0 || Number(academicInfo.twelfthPercentage) > 100)) && (
                <small style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                  Score range (0.00% – 100.00%)
                </small>
              )}
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
            <button type="button" onClick={() => handleGoToSection(4)} className="btn btn-primary btn-sm">
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
            <button type="button" onClick={() => handleGoToSection(5)} className="btn btn-primary btn-sm">
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
              <label className="form-label">Rank / Score (Integer)</label>
              <input
                type="number"
                step="1"
                min="1"
                max="500000"
                className="form-control"
                placeholder="e.g. 1420 (Positive integer >= 1)"
                style={{
                  borderColor: examInfo.rankOrScore !== undefined && examInfo.rankOrScore !== '' && Number(examInfo.rankOrScore) < 1 ? '#ef4444' : undefined
                }}
                value={examInfo.rankOrScore ?? ''}
                onKeyDown={(e) => {
                  if (['.', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 7);
                  setExamInfo({ ...examInfo, rankOrScore: digits ? parseInt(digits, 10) : '' });
                }}
                disabled={isReadOnly}
              />
              {examInfo.rankOrScore !== undefined && examInfo.rankOrScore !== '' && Number(examInfo.rankOrScore) < 1 && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', fontWeight: 500 }}>
                  ⚠️ Rank must be a positive integer (minimum: 1)
                </small>
              )}
              <small style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                Positive integer rank (no negative values)
              </small>
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
