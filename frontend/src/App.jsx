import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import ProtectedRoute from './components/common/ProtectedRoute';
import { CardSkeleton } from './components/common/Skeleton';
import './i18n/i18n';

// Lazy-loaded route pages
const LandingHome = lazy(() => import('./pages/LandingHome'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ScanPlant = lazy(() => import('./pages/ScanPlant'));
const History = lazy(() => import('./pages/History'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Esp32PinScanner = lazy(() => import('./pages/Esp32PinScanner'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

/**
 * Syncs user.sessionId into the browser URL query parameter `?session=sess_...`
 * so the active session is always visible and preserved in the web address bar.
 */
function SessionUrlSync() {
  const { user, sessionId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const currentSession = searchParams.get('session');

    if (user && sessionId) {
      if (currentSession !== sessionId) {
        const newParams = new URLSearchParams(location.search);
        newParams.set('session', sessionId);
        navigate(
          {
            pathname: location.pathname,
            search: newParams.toString(),
          },
          { replace: true }
        );
      }
    } else if (!user && currentSession) {
      const newParams = new URLSearchParams(location.search);
      newParams.delete('session');
      navigate(
        {
          pathname: location.pathname,
          search: newParams.toString(),
        },
        { replace: true }
      );
    }
  }, [user, sessionId, location.pathname, location.search, navigate, searchParams]);

  return null;
}

function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f9f5] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Header />

      <div className="flex flex-1 mx-auto w-full max-w-7xl">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Authenticated Role-Aware Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.FARMER, ROLES.OPERATOR, ROLES.ADMIN]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.FARMER, ROLES.OPERATOR, ROLES.ADMIN]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/scan"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.FARMER, ROLES.OPERATOR, ROLES.ADMIN]}>
                    <ScanPlant />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.FARMER, ROLES.OPERATOR, ROLES.ADMIN]}>
                    <History />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hardware-scan"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.OPERATOR, ROLES.ADMIN]}>
                    <Esp32PinScanner />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.FARMER, ROLES.OPERATOR, ROLES.ADMIN]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Public Home Overview Route */}
              <Route
                path="/home"
                element={<LandingHome onLoginSuccess={() => {}} />}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <SessionUrlSync />
      <Routes>
        {/* If user is not logged in and lands on root '/', show the Home Web Page! */}
        <Route
          path="/"
          element={
            user ? <MainLayout /> : <LandingHome onLoginSuccess={() => {}} />
          }
        />
        <Route path="/home" element={<LandingHome onLoginSuccess={() => {}} />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLoginSuccess={() => {}} />} />
        {/* All authenticated dashboard pages */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

