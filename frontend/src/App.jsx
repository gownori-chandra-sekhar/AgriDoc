import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import Login from './pages/Login';
import LandingHome from './pages/LandingHome';
import Dashboard from './pages/Dashboard';
import ScanPlant from './pages/ScanPlant';
import History from './pages/History';
import Analytics from './pages/Analytics';
import { getRobotStatus } from './services/api';
import './i18n/i18n';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agridoc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [robotStatus, setRobotStatus] = useState(null);

  useEffect(() => {
    if (user) {
      fetchRobotStatus();
      const interval = setInterval(fetchRobotStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchRobotStatus = async () => {
    try {
      const status = await getRobotStatus();
      setRobotStatus(status);
    } catch (err) {
      console.error('Error fetching robot status:', err);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('agridoc_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('agridoc_user');
  };

  // Pre-Login View
  if (!user) {
    return <LandingHome onLoginSuccess={handleLoginSuccess} />;
  }

  // Authenticated Portal Workspace View
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header robotStatus={robotStatus} user={user} onLogout={handleLogout} />

        <div className="flex flex-1 mx-auto w-full max-w-7xl">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scan" element={<ScanPlant />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
