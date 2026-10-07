import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ApplicationForm from './pages/student/ApplicationForm';
import DocumentUpload from './pages/student/DocumentUpload';
import PaymentPage from './pages/student/PaymentPage';
import ApplicationView from './pages/student/ApplicationView';
import ExamStatus from './pages/student/ExamStatus';
import CounsellingPage from './pages/student/CounsellingPage';
import Notifications from './pages/student/Notifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationsList from './pages/admin/ApplicationsList';
import ApplicantDetail from './pages/admin/ApplicantDetail';
import CounsellingAlloc from './pages/admin/CounsellingAlloc';
import ExamManagement from './pages/admin/ExamManagement';
import CourseManagement from './pages/admin/CourseManagement';

function App() {
  return (
    <Routes>
      {/* Figma Admission Website Layout (Root) */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Pages */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Student Protected Portal */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<StudentLayout />}>
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/application" element={<ApplicationForm />} />
          <Route path="/student/documents" element={<DocumentUpload />} />
          <Route path="/student/payment" element={<PaymentPage />} />
          <Route path="/student/application/view" element={<ApplicationView />} />
          <Route path="/student/exam" element={<ExamStatus />} />
          <Route path="/student/counselling" element={<CounsellingPage />} />
          <Route path="/student/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Admin Protected Portal */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<ApplicationsList />} />
          <Route path="/admin/applications/:id" element={<ApplicantDetail />} />
          <Route path="/admin/counselling" element={<CounsellingAlloc />} />
          <Route path="/admin/exams" element={<ExamManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
