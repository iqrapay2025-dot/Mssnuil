import { useNavigate } from 'react-router-dom';
import { Resources } from '../components/Resources';

export function ResourcesPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <Resources onBack={handleBack} />;
}
