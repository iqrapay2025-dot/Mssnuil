import { useNavigate } from 'react-router-dom';
import { AdminLogin } from '../components/AdminLogin';

export function AdminLoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/admin/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <AdminLogin onLogin={handleLogin} onNavigateHome={handleNavigateHome} />;
}
