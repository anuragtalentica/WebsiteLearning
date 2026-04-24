import { createBrowserRouter, RouterProvider, Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
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
import NotFoundPage from '@/pages/NotFoundPage';
import ContactPage from '@/pages/ContactPage';
import { GraduationCap, Mail, BookOpen, FlaskConical, Route, Trophy, Newspaper } from 'lucide-react';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card mt-auto">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <GraduationCap className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <span className="text-lg font-bold text-gradient">ExamPrep</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A focused platform for IT certification prep — structured lessons, practice questions, and timed mock exams, all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/courses', label: 'Courses', icon: BookOpen },
                { to: '/tests', label: 'Mock Tests', icon: FlaskConical },
                { to: '/paths', label: 'Cert Paths', icon: Route },
                { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
                { to: '/news', label: 'News', icon: Newspaper },
              ].map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Icon className="h-3.5 w-3.5" />{label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Contact Support</h3>
            <a href="mailto:support@examprep.dev"
              className="flex items-center gap-3 mb-6 group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                support@examprep.dev
              </span>
            </a>
            <h3 className="text-sm font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-2">
              {[
                {
                  href: 'https://twitter.com', label: 'X (Twitter)',
                  svg: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>,
                },
                {
                  href: 'https://linkedin.com', label: 'LinkedIn',
                  svg: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                },
                {
                  href: 'https://github.com', label: 'GitHub',
                  svg: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
                },
              ].map(({ href, label, svg }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all">
                  {svg}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; {year} ExamPrep. All rights reserved.</p>
          <p>Built for learners, by learners.</p>
        </div>
      </div>
    </footer>
  );
}

const QUIET_ROUTES = ['/lessons/', '/practice/', '/tests/'];

function AppLayout() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isStudyRoute = QUIET_ROUTES.some(r => location.pathname.startsWith(r));
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {!isAdmin && !isStudyRoute && <NewsTicker />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },

      // Courses
      { path: '/courses', element: <CoursesPage /> },
      { path: '/courses/:certId', element: <CourseDetailPage /> },
      { path: '/courses/:certId/topics', element: <TopicsPage /> },
      { path: '/lessons/:lessonId', element: <LessonPage /> },
      { path: '/practice/:topicId', element: <QuestionPracticePage /> },
      { path: '/practice/retry', element: <QuestionPracticePage /> },

      // Mock Tests
      { path: '/tests', element: <MockTestsPage /> },
      {
        path: '/tests/:testId',
        element: <ProtectedRoute><MockTestTakePage /></ProtectedRoute>,
      },
      {
        path: '/tests/:testId/result',
        element: <ProtectedRoute><TestResultPage /></ProtectedRoute>,
      },

      // Other
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/paths', element: <CertPathsPage /> },
      { path: '/paths/:pathId', element: <CertPathDetailPage /> },
      { path: '/news', element: <NewsPage /> },
      { path: '/profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: '/dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: '/admin', element: <AdminRoute><AdminPage /></AdminRoute> },

      // Static
      { path: '/about', element: <AboutPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/contact', element: <ContactPage /> },

      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" richColors closeButton />
      </ThemeProvider>
    </AuthProvider>
  );
}
