import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [logoTaps, setLogoTaps] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogoClick = () => {
    const now = Date.now();
    const recentTaps = [...logoTaps, now].filter(time => now - time < 5000);
    
    setLogoTaps(recentTaps);

    if (recentTaps.length >= 3) {
      navigate('/admin/login');
      setLogoTaps([]);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage onLogoClick={handleLogoClick} />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
