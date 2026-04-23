import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Layout/Navbar';
import NewsTicker from '@/components/NewsTicker';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import AdminRoute from '@/components/Layout/AdminRoute';
import AdminPage from '@/pages/AdminPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import LessonPage from '@/pages/LessonPage';
import TopicsPage from '@/pages/TopicsPage';
import QuestionPracticePage from '@/pages/QuestionPracticePage';
import MockTestsPage from '@/pages/MockTestsPage';
import MockTestTakePage from '@/pages/MockTestTakePage';
import TestResultPage from '@/pages/TestResultPage';
import CertPathsPage from '@/pages/CertPathsPage';
import CertPathDetailPage from '@/pages/CertPathDetailPage';
import NewsPage from '@/pages/NewsPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ExamPrep. Built for learners, by learners.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AppContent() {
  const { isAdmin } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {!isAdmin && <NewsTicker />}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Courses / Certifications */}
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:certId" element={<CourseDetailPage />} />
                <Route path="/courses/:certId/topics" element={<TopicsPage />} />
                <Route path="/lessons/:lessonId" element={<LessonPage />} />
                <Route path="/practice/:topicId" element={<QuestionPracticePage />} />
                <Route path="/practice/retry" element={<QuestionPracticePage />} />

                {/* Mock Tests */}
                <Route path="/tests" element={<MockTestsPage />} />
                <Route path="/tests/:testId" element={
                  <ProtectedRoute><MockTestTakePage /></ProtectedRoute>
                } />
                <Route path="/tests/:testId/result" element={
                  <ProtectedRoute><TestResultPage /></ProtectedRoute>
                } />

                {/* Leaderboard */}
                <Route path="/leaderboard" element={<LeaderboardPage />} />

                {/* Cert Paths */}
                <Route path="/paths" element={<CertPathsPage />} />
                <Route path="/paths/:pathId" element={<CertPathDetailPage />} />

                {/* News */}
                <Route path="/news" element={<NewsPage />} />

                {/* Profile */}
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />

                {/* Dashboard */}
                <Route path="/dashboard" element={
                  <ProtectedRoute><DashboardPage /></ProtectedRoute>
                } />

                {/* Admin */}
                <Route path="/admin" element={
                  <AdminRoute><AdminPage /></AdminRoute>
                } />

                {/* Static pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
