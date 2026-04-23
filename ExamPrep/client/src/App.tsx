import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
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

function AppLayout() {
  const { isAdmin } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {!isAdmin && <NewsTicker />}
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
