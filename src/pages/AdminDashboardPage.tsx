import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <AdminDashboard onLogout={handleLogout} onNavigateHome={handleNavigateHome} />;
}
