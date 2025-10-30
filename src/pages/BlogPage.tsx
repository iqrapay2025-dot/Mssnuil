import { useNavigate } from 'react-router-dom';
import { Blog } from '../components/Blog';

export function BlogPage() {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <Blog onNavigateHome={handleNavigateHome} />;
}
