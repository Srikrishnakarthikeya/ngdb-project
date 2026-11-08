import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import PublicEventsPage from './pages/public/PublicEventsPage';
import PublicEventDetailPage from './pages/public/PublicEventDetailPage';
import EventPaymentPage from './pages/student/EventPaymentPage';
import StudentLoginPage from './pages/public/StudentLoginPage';
import WalletTopUpConfirmationPage from './pages/public/WalletTopUpConfirmationPage';
import AdminLoginPage from './pages/public/AdminLoginPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentWalletPage from './pages/student/StudentWalletPage';
import MyRegistrationsPage from './pages/student/MyRegistrationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentAccommodationPage from './pages/student/StudentAccommodationPage';
import StudentHospitalityPage from './pages/student/StudentHospitalityPage';
import StudentCertificatesPage from './pages/student/StudentCertificatesPage';
import StudentFeedbackPage from './pages/student/StudentFeedbackPage';
import StudentGalleryPage from './pages/student/StudentGalleryPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EventManagementPage from './pages/admin/EventManagementPage';
import DepartmentManagementPage from './pages/admin/DepartmentManagementPage';
import VenueManagementPage from './pages/admin/VenueManagementPage';
import CoordinatorManagementPage from './pages/admin/CoordinatorManagementPage';
import EventCoordinatorAssignmentPage from './pages/admin/EventCoordinatorAssignmentPage';
import ParticipantManagementPage from './pages/admin/ParticipantManagementPage';
import RegistrationManagementPage from './pages/admin/RegistrationManagementPage';
import SponsorManagementPage from './pages/admin/SponsorManagementPage';
import PublicityManagementPage from './pages/admin/PublicityManagementPage';
import AccommodationManagementPage from './pages/admin/AccommodationManagementPage';
import HospitalityManagementPage from './pages/admin/HospitalityManagementPage';
import EvaluationManagementPage from './pages/admin/EvaluationManagementPage';
import CertificateManagementPage from './pages/admin/CertificateManagementPage';
import CompletionReportPage from './pages/admin/CompletionReportPage';
import PhotoGalleryManagementPage from './pages/admin/PhotoGalleryManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<PublicEventsPage />} />
        <Route path="/events/:id" element={<PublicEventDetailPage />} />
        <Route path="/events/:id/payment" element={<EventPaymentPage />} />
        <Route path="/gallery" element={<StudentGalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/wallet/confirm" element={<WalletTopUpConfirmationPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
      </Route>

      {/* Student Portal Pages */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="wallet" element={<StudentWalletPage />} />
        <Route path="events" element={<PublicEventsPage />} />
        <Route path="events/:id" element={<PublicEventDetailPage />} />
        <Route path="events/:id/payment" element={<EventPaymentPage />} />
        <Route path="registrations" element={<MyRegistrationsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="accommodation" element={<StudentAccommodationPage />} />
        <Route path="hospitality" element={<StudentHospitalityPage />} />
        <Route path="certificates" element={<StudentCertificatesPage />} />
        <Route path="feedback" element={<StudentFeedbackPage />} />
        <Route path="gallery" element={<StudentGalleryPage />} />
      </Route>

      {/* Admin & Coordinator Portal Pages */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="events" element={<EventManagementPage />} />
        <Route path="events/new" element={<EventManagementPage />} />
        <Route path="departments" element={<DepartmentManagementPage />} />
        <Route path="venues" element={<VenueManagementPage />} />
        <Route path="coordinators" element={<CoordinatorManagementPage />} />
        <Route path="event-coordinators" element={<EventCoordinatorAssignmentPage />} />
        <Route path="participants" element={<ParticipantManagementPage />} />
        <Route path="registrations" element={<RegistrationManagementPage />} />
        <Route path="accommodation" element={<AccommodationManagementPage />} />
        <Route path="hospitality" element={<HospitalityManagementPage />} />
        <Route path="sponsors" element={<SponsorManagementPage />} />
        <Route path="publicity" element={<PublicityManagementPage />} />
        <Route path="evaluations" element={<EvaluationManagementPage />} />
        <Route path="certificates" element={<CertificateManagementPage />} />
        <Route path="reports" element={<CompletionReportPage />} />
        <Route path="gallery" element={<PhotoGalleryManagementPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
