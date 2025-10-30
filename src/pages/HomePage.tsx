import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { VisionMissionSection } from '../components/sections/VisionMissionSection';
import { StructureSection } from '../components/sections/StructureSection';
import { FocusAreasSection } from '../components/sections/FocusAreasSection';
import { ProgramsSection } from '../components/sections/ProgramsSection';
import { GallerySection } from '../components/sections/GallerySection';
import { GetInvolvedSection } from '../components/sections/GetInvolvedSection';
import { ContactSection } from '../components/sections/ContactSection';
import { StatsCounter } from '../components/StatsCounter';
import { Testimonials } from '../components/Testimonials';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { QuickLinks } from '../components/QuickLinks';
import { PrayerTimes } from '../components/PrayerTimes';
import { BackToTop } from '../components/BackToTop';

interface HomePageProps {
  onLogoClick: () => void;
}

export function HomePage({ onLogoClick }: HomePageProps) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToResources = () => {
    navigate('/resources');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header scrolled={scrolled} onLogoClick={onLogoClick} scrollToSection={scrollToSection} />
      
      <HeroSection scrollToSection={scrollToSection} />
      
      <AboutSection />
      
      <StatsCounter />
      
      <VisionMissionSection />
      
      <StructureSection />
      
      <FocusAreasSection />
      
      <ProgramsSection />
      
      <UpcomingEvents />
      
      <GallerySection />
      
      <Testimonials />
      
      <GetInvolvedSection scrollToSection={scrollToSection} />
      
      <QuickLinks onNavigateToResources={navigateToResources} />
      
      <PrayerTimes />
      
      <ContactSection />
      
      <Footer />
      
      <BackToTop />
    </div>
  );
}
