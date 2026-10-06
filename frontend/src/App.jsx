import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import ProtectedRoute from './components/common/ProtectedRoute';
import { CardSkeleton } from './components/common/Skeleton';
import './i18n/i18n';

// Lazy-loaded route pages for optimal mobile performance & fast startup
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

function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
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

              {/* Field Operator & Admin specific routes */}
              <Route
                path="/hardware-scan"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.OPERATOR, ROLES.ADMIN]}>
                    <Esp32PinScanner />
                  </ProtectedRoute>
                }
              />

              {/* Admin / Agronomist specific route */}
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* General Settings */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.FARMER, ROLES.OPERATOR, ROLES.ADMIN]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Public Showcase preview */}
              <Route
                path="/showcase"
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

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
