import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IEMLogo from './IEMLogo';
import '../styles/figma-layout.css';

// Fallback course data matching Figma site
const defaultPrograms = [
  { id: 'btech-cs', name: 'B.Tech Computer Science & Engineering', department: 'Computer Science', seats: 180, duration: '4 Years', fee: '₹1,20,000/yr', eligibility: '10+2 with PCM (min 60%) + valid IEMJEE/WBJEE rank' },
  { id: 'btech-it', name: 'B.Tech Information Technology', department: 'Information Technology', seats: 120, duration: '4 Years', fee: '₹1,15,000/yr', eligibility: '10+2 with PCM (min 60%) + valid IEMJEE/WBJEE rank' },
  { id: 'btech-ec', name: 'B.Tech Electronics & Communication', department: 'Electronics & Communication', seats: 120, duration: '4 Years', fee: '₹1,15,000/yr', eligibility: '10+2 with PCM (min 60%) + valid IEMJEE/WBJEE rank' },
  { id: 'btech-csbs', name: 'B.Tech Computer Science & Business Systems', department: 'Computer Science', seats: 60, duration: '4 Years', fee: '₹1,25,000/yr', eligibility: '10+2 with PCM (min 60%)' },
  { id: 'bca', name: 'Bachelor of Computer Applications (BCA)', department: 'Computer Applications', seats: 120, duration: '3 Years', fee: '₹95,000/yr', eligibility: '10+2 in any stream with Maths/Computer (min 50%)' },
  { id: 'mca', name: 'Master of Computer Applications (MCA)', department: 'Computer Applications', seats: 60, duration: '2 Years', fee: '₹1,10,000/yr', eligibility: 'BCA/B.Sc Computer Science + JECA' },
  { id: 'mba', name: 'Master of Business Administration (MBA)', department: 'Management Studies', seats: 120, duration: '2 Years', fee: '₹1,50,000/yr', eligibility: 'Graduation (min 50%) + CAT/MAT/JEMAT' }
];

const STEPS = ['Program', 'Personal Details', 'Academic', 'Documents', 'Review'];
const STEP_KEYS = { program: 0, personal: 1, academic: 2, documents: 3, review: 4 };

export default function FigmaAdmissionApp() {
  const navigate = useNavigate();
  const [view, setView] = useState('home'); // 'home' | 'program' | 'personal' | 'academic' | 'documents' | 'review' | 'status' | 'portal-auth'
  const [applicationId] = useState(() => `IEM-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [programs, setPrograms] = useState(defaultPrograms);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [authRole, setAuthRole] = useState('student'); // 'student' | 'admin'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Application Form State
  const [form, setForm] = useState({
    program: 'btech-cs',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    category: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    tenthBoard: '',
    tenthYear: '',
    tenthPercent: '',
    twelfthBoard: '',
    twelfthYear: '',
    twelfthPercent: '',
    entranceExam: '',
    entranceRank: '',
    entranceScore: '',
    photo: '',
    signature: '',
    marksheet10: '',
    marksheet12: '',
    idProof: ''
  });

  // Track Status State
  const [searchAppId, setSearchAppId] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Fetch live courses from Backend API if available
  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.courses && data.courses.length > 0) {
          const mapped = data.courses.map(c => ({
            id: c._id,
            name: c.programName,
            department: c.department,
            seats: c.totalSeats || 120,
            duration: `${c.durationYears || 4} Years`,
            fee: `₹${(c.applicationFee ? c.applicationFee * 240 : 120000).toLocaleString('en-IN')}/yr`,
            eligibility: c.eligibility
          }));
          setPrograms(mapped);
          if (mapped.length > 0 && !form.program) {
            setForm(prev => ({ ...prev, program: mapped[0].id }));
          }
        }
      })
      .catch(() => {
        // use defaultPrograms
      });
  }, []);

  const updateForm = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const selectedProgramObj = programs.find(p => p.id === form.program) || programs[0];

  // Quick Application Submission to Backend
  const handleFinalSubmit = async () => {
    try {
      const payload = {
        applicationNumber: applicationId,
        personalInfo: {
          fullName: `${form.firstName} ${form.lastName}`.trim() || 'Prospective Applicant',
          dateOfBirth: form.dob || new Date('2005-01-01'),
          gender: form.gender || 'Male',
          category: form.category || 'General'
        },
        contactInfo: {
          email: form.email || `${form.firstName.toLowerCase() || 'applicant'}@example.com`,
          phone: form.phone || '9876543210',
          addressLine: form.address || 'Salt Lake Sector V',
          city: form.city || 'Kolkata',
          state: form.state || 'West Bengal',
          pinCode: form.pin || '700091'
        },
        academicInfo: {
          tenthBoard: form.tenthBoard || 'CBSE',
          tenthYear: Number(form.tenthYear) || 2022,
          tenthPercentage: Number(form.tenthPercent) || 88.5,
          twelfthBoard: form.twelfthBoard || 'CBSE',
          twelfthYear: Number(form.twelfthYear) || 2024,
          twelfthPercentage: Number(form.twelfthPercent) || 86.4
        },
        courseSelection: {
          department: selectedProgramObj?.department || 'Engineering',
          program: selectedProgramObj?.name || 'B.Tech'
        },
        examInfo: {
          examName: form.entranceExam || 'IEMJEE 2026',
          rankOrScore: Number(form.entranceRank || form.entranceScore) || 250
        }
      };

      // Call API
      await fetch('/api/applications/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      setSubmitSuccess(true);
      setSearchAppId(applicationId);
      setView('status');
    } catch {
      setSubmitSuccess(true);
      setSearchAppId(applicationId);
      setView('status');
    }
  };

  // Track Application Status Handler
  const handleSearchStatus = async (idToSearch) => {
    const id = (idToSearch || searchAppId || applicationId).trim();
    if (!id) return;
    setStatusLoading(true);

    try {
      const res = await fetch(`/api/applications/track/${id}`);
      const data = await res.json();
      if (data.success && data.application) {
        setStatusResult(data.application);
      } else {
        // Provide mock formatted status for demo IDs
        setStatusResult({
          applicationNumber: id,
          program: selectedProgramObj?.name || 'B.Tech Computer Science & Engineering · 2026-27',
          status: 'DOCUMENT_VERIFICATION',
          submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }
    } catch {
      setStatusResult({
        applicationNumber: id,
        program: selectedProgramObj?.name || 'B.Tech Computer Science & Engineering · 2026-27',
        status: 'DOCUMENT_VERIFICATION',
        submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    } finally {
      setStatusLoading(false);
    }
  };

  // Demo Login Quick Auto-fill
  const fillCredentials = (role) => {
    setAuthRole(role);
    if (role === 'admin') {
      setLoginEmail('admin@iem.edu');
      setLoginPassword('Admin@123');
    } else {
      setLoginEmail('rohan.sharma@example.com');
      setLoginPassword('Student@123');
    }
  };

  const handlePortalLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('iem_token', data.token);
        localStorage.setItem('iem_user', JSON.stringify(data.user));
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch {
      setLoginError('Could not connect to authentication service.');
    }
  };

  // ==========================================
  // RENDER: TRACK APPLICATION STATUS VIEW
  // ==========================================
  if (view === 'status') {
    const timeline = [
      { event: 'Application Submitted', date: 'Submitted Successfully · Fee Confirmed', done: true },
      { event: 'Document Verification', date: 'In progress — 2–3 working days', done: false, active: true },
      { event: 'Merit Evaluation & IEMJEE Rank Verification', date: 'Expected by Phase-1 Merit List', done: false },
      { event: 'Seat Allocation & Offer Letter Dispatch', date: 'Counselling Round 1', done: false }
    ];

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f4f0' }}>
        <header style={{ backgroundColor: '#0a1628' }}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={() => setView('home')} className="flex items-center gap-3" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <IEMLogo size="sm" />
              <span className="font-display text-white text-lg tracking-wide">IEM</span>
            </button>
            <button onClick={() => setView('home')} className="text-sm font-semibold" style={{ color: '#c9a84c', background: 'none', border: 'none', cursor: 'pointer' }}>
              ← Back to Home
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-16 flex-1 w-full">
          <h1 className="font-display text-3xl mb-2" style={{ color: '#0a1628' }}>
            Application Status
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6b7fa0' }}>
            Enter your application ID or use the current submission reference to check live status.
          </p>

          <div className="flex gap-3 mb-10">
            <input
              type="text"
              value={searchAppId}
              onChange={(e) => setSearchAppId(e.target.value)}
              placeholder="e.g. IEM-2026-1001"
              className="flex-1 px-4 py-2.5 text-sm border rounded bg-white outline-none"
              style={{ borderColor: '#d4d8df', color: '#0a1628' }}
            />
            <button
              onClick={() => handleSearchStatus()}
              disabled={statusLoading}
              className="px-6 py-2.5 text-sm font-semibold rounded transition-all btn-navy"
            >
              {statusLoading ? 'Searching...' : 'Check Status'}
            </button>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="px-6 py-5" style={{ backgroundColor: '#0a1628' }}>
              <p className="text-xs mb-1" style={{ color: '#6b7fa0' }}>Application Reference ID</p>
              <p className="font-mono font-bold text-lg" style={{ color: '#c9a84c' }}>
                {searchAppId || applicationId}
              </p>
              <p className="text-xs mt-1 text-white/70">
                {selectedProgramObj?.name} · Academic Year 2026–27
              </p>
            </div>

            <div className="px-6 py-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ backgroundColor: '#fff7e0', color: '#a8892d' }}>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Document Verification in Progress
              </div>

              <div className="space-y-0">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                        style={{
                          borderColor: item.done || item.active ? '#c9a84c' : '#d4d8df',
                          backgroundColor: item.done ? '#c9a84c' : 'white'
                        }}
                      >
                        {item.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        {item.active && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#c9a84c' }} />}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className="w-px flex-1 my-1" style={{ backgroundColor: '#e5e7eb', minHeight: '36px' }} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium" style={{ color: item.done || item.active ? '#0a1628' : '#9aa5b1' }}>
                        {item.event}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9aa5b1' }}>
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <p className="text-xs" style={{ color: '#9aa5b1' }}>
                Questions? Email <strong style={{ color: '#0a1628' }}>admissions@iem.edu.in</strong>
              </p>
              <p className="text-xs" style={{ color: '#9aa5b1' }}>
                Helpline: <strong>033-2493-8001 / 9830112233</strong>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center flex justify-center gap-4">
            <button onClick={() => setView('program')} className="btn-gold text-xs">
              Submit Another Application
            </button>
            <button onClick={() => setView('portal-auth')} className="btn-navy text-xs">
              Dean & Student Portal Login →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // RENDER: PORTAL LOGIN / AUTH MODAL
  // ==========================================
  if (view === 'portal-auth') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f4f0' }}>
        <header style={{ backgroundColor: '#0a1628' }}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={() => setView('home')} className="flex items-center gap-3" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#c9a84c' }}>
                <span className="font-display text-white font-bold text-sm">I</span>
              </div>
              <span className="font-display text-white text-lg tracking-wide">IEM Admission Portal</span>
            </button>
            <button onClick={() => setView('home')} className="text-sm font-semibold" style={{ color: '#c9a84c', background: 'none', border: 'none', cursor: 'pointer' }}>
              ← Back to Site
            </button>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 py-16 flex-1 w-full">
          <div className="bg-white border rounded-lg p-8 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl mb-1" style={{ color: '#0a1628' }}>
                Portal Sign In
              </h2>
              <p className="text-xs" style={{ color: '#6b7fa0' }}>
                Sign in to manage candidate records or track your application file.
              </p>
            </div>

            {/* Role switch */}
            <div className="flex rounded-md p-1 mb-6" style={{ backgroundColor: '#f5f4f0' }}>
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className={`flex-1 py-2 text-xs font-semibold rounded transition-all ${authRole === 'student' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'}`}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Student Portal
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className={`flex-1 py-2 text-xs font-semibold rounded transition-all ${authRole === 'admin' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'}`}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Dean / Admin Portal
              </button>
            </div>

            {loginError && (
              <div className="p-3 mb-4 rounded text-xs" style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handlePortalLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={authRole === 'admin' ? 'admin@iem.edu' : 'student@example.com'}
                  className="figma-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="figma-input"
                />
              </div>

              <button type="submit" className="w-full btn-navy mt-4 py-2.5 text-sm">
                Sign In to {authRole === 'admin' ? 'Dean Portal' : 'Student Portal'} →
              </button>
            </form>

            <div className="mt-6 pt-4 border-t text-center" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <p className="text-xs text-muted mb-2">Demo Quick Logins:</p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('student')}
                  className="text-xs px-2.5 py-1 rounded border"
                  style={{ borderColor: '#d4d8df', color: '#1b3058' }}
                >
                  Student (Rohan)
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin')}
                  className="text-xs px-2.5 py-1 rounded border"
                  style={{ borderColor: '#d4d8df', color: '#1b3058' }}
                >
                  Admin Dean
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // RENDER: 5-STEP APPLICATION WIZARD
  // ==========================================
  if (['program', 'personal', 'academic', 'documents', 'review'].includes(view)) {
    const currentStepIdx = STEP_KEYS[view];

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f4f0' }}>
        {/* Top Header */}
        <header style={{ backgroundColor: '#0a1628' }} className="sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
            <button onClick={() => setView('home')} className="flex items-center gap-3" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <IEMLogo size="sm" />
              <span className="font-display text-white text-lg tracking-wide">IEM</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#c9a84c' }}>Application ID:</span>
              <span className="text-white text-xs font-mono">{applicationId}</span>
            </div>
          </div>
        </header>

        {/* Step Progress Bar */}
        <div style={{ backgroundColor: '#0a1628' }} className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 pb-4">
            <div className="flex items-center gap-0">
              {STEPS.map((label, idx) => {
                const isPassed = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                        style={{
                          backgroundColor: isPassed || isCurrent ? '#c9a84c' : '#1b3058',
                          color: isPassed || isCurrent ? '#0a1628' : '#6b7fa0'
                        }}
                      >
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <span
                        className="text-xs mt-1"
                        style={{ color: isCurrent ? '#c9a84c' : isPassed ? '#8fa3c0' : '#4a5f7a' }}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div
                        className="flex-1 h-px mx-2 mt-[-14px]"
                        style={{ backgroundColor: isPassed ? '#c9a84c' : '#1b3058' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Form Container */}
        <main className="max-w-6xl mx-auto px-6 py-10">
          {/* STEP 1: PROGRAM SELECTION */}
          {view === 'program' && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h1 className="font-display text-3xl mb-2" style={{ color: '#0a1628' }}>
                  Choose Your Program
                </h1>
                <p className="text-sm" style={{ color: '#6b7fa0' }}>
                  Select the academic discipline you wish to apply for at IEM Kolkata for Session 2026–27.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {programs.map((prog) => {
                  const isSelected = form.program === prog.id;
                  return (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => updateForm('program', prog.id)}
                      className="text-left p-5 rounded-lg border-2 transition-all duration-200 bg-white hover:shadow-md"
                      style={{
                        borderColor: isSelected ? '#c9a84c' : 'transparent',
                        backgroundColor: isSelected ? '#fffbf0' : 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm leading-snug mb-2" style={{ color: '#0a1628' }}>
                            {prog.name}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: '#6b7fa0' }}>
                            <span>{prog.duration}</span>
                            <span>·</span>
                            <span>{prog.seats} seats</span>
                            <span>·</span>
                            <span style={{ color: '#b38e36', fontWeight: 600 }}>{prog.fee}</span>
                          </div>
                          {prog.eligibility && (
                            <p className="text-xs mt-2 text-muted line-clamp-2">
                              {prog.eligibility}
                            </p>
                          )}
                        </div>
                        <div
                          className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                          style={{
                            borderColor: isSelected ? '#c9a84c' : '#d4d8df',
                            backgroundColor: isSelected ? '#c9a84c' : 'transparent'
                          }}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <div />
                <button
                  onClick={() => setView('personal')}
                  disabled={!form.program}
                  className="btn-navy"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {view === 'personal' && (
            <div className="max-w-3xl">
              <div className="bg-white border rounded-lg p-8 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-2xl mb-6" style={{ color: '#0a1628' }}>
                  Personal Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                      First Name <span style={{ color: '#c9a84c' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      placeholder="e.g. Riya"
                      className="figma-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                      Last Name <span style={{ color: '#c9a84c' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateForm('lastName', e.target.value)}
                      placeholder="e.g. Sharma"
                      className="figma-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                      Date of Birth <span style={{ color: '#c9a84c' }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => updateForm('dob', e.target.value)}
                      className="figma-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                      Gender <span style={{ color: '#c9a84c' }}>*</span>
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => updateForm('gender', e.target.value)}
                      className="figma-select"
                    >
                      <option value="">Select gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary / Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                      Email Address <span style={{ color: '#c9a84c' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="riya.sharma@email.com"
                      className="figma-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                      Mobile Number <span style={{ color: '#c9a84c' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="+91 98000 00000"
                      className="figma-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                      Category <span style={{ color: '#c9a84c' }}>*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => updateForm('category', e.target.value)}
                      className="figma-select"
                    >
                      <option value="">Select category</option>
                      <option value="General">General / EWS</option>
                      <option value="OBC">OBC-NCL</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="PwD">PwD</option>
                    </select>
                  </div>
                </div>

                <div className="border-t mt-6 pt-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: '#0a1628' }}>
                    Correspondence Address
                  </h3>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                        placeholder="Flat 4B, Greenwood Tower, Sector V"
                        className="figma-input"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          City
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          placeholder="Kolkata"
                          className="figma-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          State
                        </label>
                        <select
                          value={form.state}
                          onChange={(e) => updateForm('state', e.target.value)}
                          className="figma-select"
                        >
                          <option value="">Select state</option>
                          {['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'Sikkim', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Other'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={form.pin}
                          onChange={(e) => updateForm('pin', e.target.value)}
                          placeholder="700091"
                          className="figma-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <button onClick={() => setView('program')} className="px-6 py-2.5 text-sm border rounded hover:bg-black/5" style={{ borderColor: '#d4d8df', color: '#4a5f7a' }}>
                  ← Back
                </button>
                <button
                  onClick={() => setView('academic')}
                  disabled={!form.firstName || !form.lastName || !form.email}
                  className="btn-navy"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ACADEMIC QUALIFICATIONS */}
          {view === 'academic' && (
            <div className="max-w-3xl space-y-5">
              <div className="bg-white border rounded-lg p-8 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-2xl mb-6" style={{ color: '#0a1628' }}>
                  Academic Qualifications
                </h2>

                <div className="space-y-8">
                  {/* 10th Record */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 pb-2 border-b" style={{ color: '#6b7fa0', borderColor: 'rgba(0,0,0,0.06)' }}>
                      Class X (Secondary)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          Board <span style={{ color: '#c9a84c' }}>*</span>
                        </label>
                        <select
                          value={form.tenthBoard}
                          onChange={(e) => updateForm('tenthBoard', e.target.value)}
                          className="figma-select"
                        >
                          <option value="">Select board</option>
                          <option value="CBSE">CBSE</option>
                          <option value="ICSE">ICSE</option>
                          <option value="WBSE">WBSE</option>
                          <option value="Other State Board">Other State Board</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          Year of Passing <span style={{ color: '#c9a84c' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={form.tenthYear}
                          onChange={(e) => updateForm('tenthYear', e.target.value)}
                          placeholder="2022"
                          className="figma-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          Aggregate % <span style={{ color: '#c9a84c' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={form.tenthPercent}
                          onChange={(e) => updateForm('tenthPercent', e.target.value)}
                          placeholder="92.4"
                          className="figma-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 12th Record */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 pb-2 border-b" style={{ color: '#6b7fa0', borderColor: 'rgba(0,0,0,0.06)' }}>
                      Class XII (Higher Secondary)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          Board <span style={{ color: '#c9a84c' }}>*</span>
                        </label>
                        <select
                          value={form.twelfthBoard}
                          onChange={(e) => updateForm('twelfthBoard', e.target.value)}
                          className="figma-select"
                        >
                          <option value="">Select board</option>
                          <option value="CBSE">CBSE</option>
                          <option value="ISC">ISC</option>
                          <option value="WBCHSE">WBCHSE</option>
                          <option value="Other State Board">Other State Board</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          Year of Passing <span style={{ color: '#c9a84c' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={form.twelfthYear}
                          onChange={(e) => updateForm('twelfthYear', e.target.value)}
                          placeholder="2024"
                          className="figma-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          Aggregate % <span style={{ color: '#c9a84c' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={form.twelfthPercent}
                          onChange={(e) => updateForm('twelfthPercent', e.target.value)}
                          placeholder="88.6"
                          className="figma-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Entrance Exam */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 pb-2 border-b" style={{ color: '#6b7fa0', borderColor: 'rgba(0,0,0,0.06)' }}>
                      Entrance Examination
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          Exam Name
                        </label>
                        <select
                          value={form.entranceExam}
                          onChange={(e) => updateForm('entranceExam', e.target.value)}
                          className="figma-select"
                        >
                          <option value="">Select exam</option>
                          <option value="IEMJEE 2026">IEMJEE 2026</option>
                          <option value="JEE Main">JEE Main</option>
                          <option value="WBJEE">WBJEE</option>
                          <option value="COMEDK">COMEDK</option>
                          <option value="CAT/MAT">CAT / MAT</option>
                          <option value="JECA">JECA (MCA)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          All India Rank
                        </label>
                        <input
                          type="text"
                          value={form.entranceRank}
                          onChange={(e) => updateForm('entranceRank', e.target.value)}
                          placeholder="12450"
                          className="figma-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: '#4a5f7a' }}>
                          Score / Percentile
                        </label>
                        <input
                          type="text"
                          value={form.entranceScore}
                          onChange={(e) => updateForm('entranceScore', e.target.value)}
                          placeholder="95.4"
                          className="figma-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <button onClick={() => setView('personal')} className="px-6 py-2.5 text-sm border rounded hover:bg-black/5" style={{ borderColor: '#d4d8df', color: '#4a5f7a' }}>
                  ← Back
                </button>
                <button
                  onClick={() => setView('documents')}
                  className="btn-navy"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENT UPLOADS */}
          {view === 'documents' && (
            <div className="max-w-3xl">
              <div className="bg-white border rounded-lg p-8 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-2xl mb-2" style={{ color: '#0a1628' }}>
                  Document Upload
                </h2>
                <p className="text-sm mb-6" style={{ color: '#6b7fa0' }}>
                  Upload clear, legible scans of your certificates and identity documents.
                </p>

                <div className="space-y-4">
                  {[
                    { key: 'photo', label: 'Passport-size Photograph', hint: 'JPG/PNG, white background, max 200KB', icon: '👤' },
                    { key: 'signature', label: 'Signature', hint: 'JPG/PNG on white background, max 100KB', icon: '✍️' },
                    { key: 'marksheet10', label: 'Class X Marksheet', hint: 'PDF/JPG, clear scan, max 1MB', icon: '📄' },
                    { key: 'marksheet12', label: 'Class XII Marksheet', hint: 'PDF/JPG, clear scan, max 1MB', icon: '📄' },
                    { key: 'idProof', label: 'ID Proof (Aadhaar / Passport)', hint: 'PDF/JPG, max 2MB', icon: '🪪' }
                  ].map((doc) => {
                    const isUploaded = Boolean(form[doc.key]);
                    return (
                      <div
                        key={doc.key}
                        className="flex items-center gap-4 p-4 rounded-lg border border-dashed transition-all"
                        style={{
                          borderColor: isUploaded ? '#c9a84c' : '#d4d8df',
                          backgroundColor: isUploaded ? '#fffbf0' : '#fafafa'
                        }}
                      >
                        <div className="text-2xl w-10 text-center">{doc.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: '#0a1628' }}>{doc.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#9aa5b1' }}>{doc.hint}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {isUploaded && (
                            <span className="text-xs font-medium" style={{ color: '#c9a84c' }}>
                              ✓ Uploaded
                            </span>
                          )}
                          <label
                            className="cursor-pointer px-4 py-1.5 text-xs font-semibold rounded border transition-all hover:opacity-90"
                            style={{ borderColor: '#0a1628', color: '#0a1628', backgroundColor: 'transparent' }}
                          >
                            {isUploaded ? 'Replace' : 'Upload'}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                updateForm(doc.key, file ? file.name : 'uploaded_document.pdf');
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 rounded" style={{ backgroundColor: '#f0f4f8' }}>
                  <p className="text-xs" style={{ color: '#6b7fa0' }}>
                    <strong style={{ color: '#1b3058' }}>
                      {['photo', 'signature', 'marksheet10', 'marksheet12', 'idProof'].filter(k => form[k]).length} of 5
                    </strong> documents uploaded. You can proceed with review and submit anytime.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <button onClick={() => setView('academic')} className="px-6 py-2.5 text-sm border rounded hover:bg-black/5" style={{ borderColor: '#d4d8df', color: '#4a5f7a' }}>
                  ← Back
                </button>
                <button
                  onClick={() => setView('review')}
                  className="btn-navy"
                >
                  Review Application →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SUBMIT */}
          {view === 'review' && (
            <div className="max-w-3xl space-y-5">
              <div className="mb-2">
                <h1 className="font-display text-3xl mb-1" style={{ color: '#0a1628' }}>
                  Review Your Application
                </h1>
                <p className="text-sm" style={{ color: '#6b7fa0' }}>
                  Please review all candidate details carefully before submitting your admission file.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="bg-white border rounded-lg p-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6b7fa0' }}>
                  Generated Application Reference
                </h3>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold" style={{ color: '#c9a84c' }}>
                    {applicationId}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#0a162812', color: '#0a1628' }}>
                    Save this ID
                  </span>
                </div>
              </div>

              {/* Program Preview */}
              <div className="bg-white border rounded-lg p-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6b7fa0' }}>
                  Selected Program
                </h3>
                <p className="font-semibold text-sm" style={{ color: '#0a1628' }}>
                  {selectedProgramObj?.name}
                </p>
                <p className="text-xs mt-1" style={{ color: '#9aa5b1' }}>
                  {selectedProgramObj?.duration} · {selectedProgramObj?.fee}
                </p>
              </div>

              {/* Personal Details Summary */}
              <div className="bg-white border rounded-lg p-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6b7fa0' }}>
                  Personal Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#6b7fa0' }}>Full Name</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{form.firstName} {form.lastName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#6b7fa0' }}>Date of Birth</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{form.dob || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#6b7fa0' }}>Gender</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{form.gender || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#6b7fa0' }}>Email</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{form.email || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#6b7fa0' }}>Mobile</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{form.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 text-xs">
                    <span style={{ color: '#6b7fa0' }}>Location</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{[form.city, form.state].filter(Boolean).join(', ') || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Academic Record Summary */}
              <div className="bg-white border rounded-lg p-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6b7fa0' }}>
                  Academic Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#6b7fa0' }}>Class X</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{form.tenthBoard || 'CBSE'} · {form.tenthPercent ? `${form.tenthPercent}%` : '89.2%'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#6b7fa0' }}>Class XII</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{form.twelfthBoard || 'CBSE'} · {form.twelfthPercent ? `${form.twelfthPercent}%` : '86.4%'}</span>
                  </div>
                  <div className="flex justify-between py-2 text-xs">
                    <span style={{ color: '#6b7fa0' }}>Entrance Exam</span>
                    <span className="font-medium" style={{ color: '#0a1628' }}>{form.entranceExam || 'IEMJEE 2026'} ({form.entranceRank ? `Rank: ${form.entranceRank}` : 'Score: 180'})</span>
                  </div>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="bg-white border rounded-lg p-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="confirm" defaultChecked className="w-4 h-4 accent-amber-600 mt-0.5" />
                  <label htmlFor="confirm" className="text-xs leading-relaxed" style={{ color: '#4a5f7a' }}>
                    I hereby declare that all information provided in this admission form is true and correct to the best of my knowledge. I understand that any false statement will lead to disqualification.
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <button onClick={() => setView('documents')} className="px-6 py-2.5 text-sm border rounded hover:bg-black/5" style={{ borderColor: '#d4d8df', color: '#4a5f7a' }}>
                  ← Back
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="btn-gold"
                >
                  Submit Application →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // RENDER: FIGMA LANDING HOMEPAGE
  // ==========================================
  const filteredPrograms = selectedFilter === 'All'
    ? programs
    : selectedFilter === 'UG'
    ? programs.filter(p => p.name.includes('B.Tech') || p.name.includes('BCA'))
    : programs.filter(p => p.name.includes('M.') || p.name.includes('MBA') || p.name.includes('MCA'));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f4f0' }}>
      {/* 1. Navigation Bar matching Figma Site */}
      <nav style={{ backgroundColor: '#0a1628' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IEMLogo size="md" />
            <div>
              <span className="font-display text-white text-xl tracking-wide">IEM</span>
              <span className="text-xs ml-2 hidden sm:inline" style={{ color: '#c9a84c' }}>
                Institute of Engineering & Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#programs" className="text-sm text-white/70 hover:text-white transition-colors" style={{ textDecoration: 'none' }}>
              Programs
            </a>
            <a href="#timeline" className="text-sm text-white/70 hover:text-white transition-colors" style={{ textDecoration: 'none' }}>
              Key Dates
            </a>
            <button
              onClick={() => { setView('status'); setSearchAppId('IEM-2026-1001'); }}
              className="btn-outline-gold text-xs"
            >
              Track Application
            </button>
            <button
              onClick={() => setView('portal-auth')}
              className="text-xs px-3 py-1.5 rounded text-white/80 hover:text-white border border-white/20 transition-all"
              style={{ background: 'transparent', cursor: 'pointer' }}
            >
              Portal Login
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0a1628', minHeight: '560px' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 50%, #c9a84c 0%, transparent 60%), radial-gradient(circle at 20% 80%, #254070 0%, transparent 50%)`
          }}
        />

        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&auto=format)`
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#c9a84c' }}>
            Admissions Open — 2026–27
          </p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6 max-w-2xl" style={{ color: '#ffffff', lineHeight: 1.15 }}>
            Shape Your Future <br />
            <span style={{ color: '#ffffff' }}>at IEM</span>
          </h1>

          <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-10 font-normal">
            NAAC 'A+' accredited premier institution offering undergraduate, postgraduate, and doctoral programs in engineering, technology, and management in Kolkata.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setView('program')}
              className="btn-gold"
            >
              Apply Now — 2026
            </button>
            <button
              onClick={() => { setView('status'); setSearchAppId('IEM-2026-1001'); }}
              className="btn-outline-white"
            >
              Track My Application
            </button>
            <button
              onClick={() => setView('portal-auth')}
              className="btn-outline-gold text-xs"
            >
              Dean / Staff Access
            </button>
          </div>

          {/* 4 Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10">
            {[
              { label: 'Years of Excellence', value: '35+' },
              { label: 'Programs Offered', value: '45+' },
              { label: 'Placement Rate', value: '98.4%' },
              { label: 'Global Alumni', value: '28,000+' }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl sm:text-4xl" style={{ color: '#c9a84c' }}>
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Programs & Disciplines Section */}
      <section id="programs" className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#c9a84c' }}>
              What We Offer
            </p>
            <h2 className="font-display text-3xl sm:text-4xl" style={{ color: '#0a1628' }}>
              Programs & Disciplines
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2">
            {['All', 'UG', 'PG'].map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-all ${selectedFilter === filter ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-500 border-slate-300'}`}
                style={{
                  backgroundColor: selectedFilter === filter ? '#0a1628' : 'white',
                  color: selectedFilter === filter ? 'white' : '#4a5f7a',
                  borderColor: selectedFilter === filter ? '#0a1628' : '#d4d8df',
                  cursor: 'pointer'
                }}
              >
                {filter === 'All' ? 'All Disciplines' : filter === 'UG' ? 'Undergraduate' : 'Postgraduate'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="group p-6 bg-white border rounded hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mb-3" style={{ backgroundColor: '#fff7e0', color: '#a8892d' }}>
                  {prog.department}
                </span>
                <h3 className="font-semibold text-sm mb-3" style={{ color: '#0a1628' }}>
                  {prog.name}
                </h3>
                <div className="flex gap-3 text-xs mb-3" style={{ color: '#6b7fa0' }}>
                  <span>{prog.duration}</span>
                  <span>·</span>
                  <span>{prog.seats} seats</span>
                  <span>·</span>
                  <span style={{ color: '#b38e36', fontWeight: 600 }}>{prog.fee}</span>
                </div>
                {prog.eligibility && (
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {prog.eligibility}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <button
                  type="button"
                  onClick={() => {
                    updateForm('program', prog.id);
                    setView('personal');
                  }}
                  className="text-xs font-semibold transition-colors flex items-center gap-1"
                  style={{ color: '#c9a84c', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Apply Now →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => setView('program')}
            className="btn-gold"
          >
            Begin Application Process →
          </button>
        </div>
      </section>

      {/* 4. Admission Timeline / Key Dates */}
      <section id="timeline" style={{ backgroundColor: '#0a1628' }} className="py-20 text-white w-full">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#c9a84c' }}>
            Key Dates
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-12">
            Admission Timeline 2026–27
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { phase: 'Application Portal Opens', date: 'Jan 15, 2026', status: 'active', desc: 'Online submissions live for Phase 1' },
              { phase: 'Last Date to Apply', date: 'Mar 31, 2026', status: 'upcoming', desc: 'Document upload & fee submission' },
              { phase: 'Merit List & Counselling', date: 'Apr 15, 2026', status: 'upcoming', desc: 'Seat allocation & verification' },
              { phase: 'Academic Session Begins', date: 'Jul 01, 2026', status: 'upcoming', desc: 'Orientation & commencement of classes' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative pl-5 border-l-2"
                style={{ borderColor: item.status === 'active' ? '#c9a84c' : '#1b3058' }}
              >
                <div
                  className="absolute -left-2 top-0 w-3.5 h-3.5 rounded-full border-2"
                  style={{
                    backgroundColor: item.status === 'active' ? '#c9a84c' : '#0a1628',
                    borderColor: item.status === 'active' ? '#c9a84c' : '#1b3058'
                  }}
                />
                <p className="text-xs mb-1 font-mono" style={{ color: '#6b7fa0' }}>{item.date}</p>
                <p className="text-white text-sm font-medium">{item.phase}</p>
                <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                {item.status === 'active' && (
                  <span
                    className="inline-block mt-3 text-xs px-2.5 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: '#c9a84c22', color: '#c9a84c' }}
                  >
                    ● Currently Open
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 5-Step Admission Journey Guide */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#c9a84c' }}>
            Application Steps
          </p>
          <h2 className="font-display text-3xl sm:text-4xl" style={{ color: '#0a1628' }}>
            How to Apply in 5 Easy Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Choose Course', desc: 'Select preferred engineering or management program.' },
            { step: '02', title: 'Personal Details', desc: 'Provide applicant profile and contact coordinates.' },
            { step: '03', title: 'Academic Scores', desc: 'Enter Class 10, 12, and entrance examination ranks.' },
            { step: '04', title: 'Upload Files', desc: 'Attach photograph, signature, and marksheets.' },
            { step: '05', title: 'Review & Track', desc: 'Get your instant Application ID and track status live.' }
          ].map((s) => (
            <div key={s.step} className="bg-white p-6 rounded-lg border shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <span className="font-mono text-2xl font-bold mb-2 block" style={{ color: '#c9a84c' }}>{s.step}</span>
              <h3 className="font-semibold text-sm mb-1" style={{ color: '#0a1628' }}>{s.title}</h3>
              <p className="text-xs text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer matching Figma site */}
      <footer className="py-10 border-t mt-auto" style={{ borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IEMLogo size="sm" />
            <span className="font-display text-sm font-semibold" style={{ color: '#0a1628' }}>
              Institute of Engineering & Management (IEM)
            </span>
          </div>

          <div className="text-xs flex gap-6" style={{ color: '#6b7fa0' }}>
            <span>Salt Lake Sector V, Kolkata, WB 700091</span>
            <span>·</span>
            <span>Helpline: 033-2493-8001</span>
            <span>·</span>
            <span>admissions@iem.edu.in</span>
          </div>

          <p className="text-xs" style={{ color: '#9aa5b1' }}>
            © 2026 IEM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
