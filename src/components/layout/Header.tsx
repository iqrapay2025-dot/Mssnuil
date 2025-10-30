import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';
import logoImage from 'figma:asset/fbc52c4cf3ddc1eecd0ce430195ad1b2888e1b5e.png';
import {
  Menu,
  ChevronRight,
  Globe,
  Users,
  Target,
  UserCircle,
  Lightbulb,
  Calendar,
  GraduationCap,
  FileText,
  BookOpen,
  Mail
} from 'lucide-react';

interface HeaderProps {
  scrolled: boolean;
  onLogoClick: () => void;
  scrollToSection: (id: string) => void;
}

export function Header({ scrolled, onLogoClick, scrollToSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img 
              src={logoImage} 
              alt="MSSN UNILORIN Logo" 
              className="h-14 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation - Mega Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2">
              Home
            </Link>
            
            {/* About Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('about')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2 flex items-center gap-1">
                About
                <ChevronRight className={`w-4 h-4 transition-transform ${megaMenuOpen === 'about' ? 'rotate-90' : 'rotate-0'}`} />
              </button>
              {megaMenuOpen === 'about' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-4">
                  <button onClick={() => { scrollToSection('about'); setMegaMenuOpen(null); }} className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-gray-700 transition-colors">
                    Who We Are
                  </button>
                  <button onClick={() => { scrollToSection('vision'); setMegaMenuOpen(null); }} className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-gray-700 transition-colors">
                    Vision & Mission
                  </button>
                  <button onClick={() => { scrollToSection('structure'); setMegaMenuOpen(null); }} className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-gray-700 transition-colors">
                    Our Structure
                  </button>
                </div>
              )}
            </div>

            {/* Programs Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('programs')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2 flex items-center gap-1">
                Programs
                <ChevronRight className={`w-4 h-4 transition-transform ${megaMenuOpen === 'programs' ? 'rotate-90' : 'rotate-0'}`} />
              </button>
              {megaMenuOpen === 'programs' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-4">
                  <button onClick={() => { scrollToSection('focus'); setMegaMenuOpen(null); }} className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-gray-700 transition-colors">
                    Core Focus Areas
                  </button>
                  <button onClick={() => { scrollToSection('programs'); setMegaMenuOpen(null); }} className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-gray-700 transition-colors">
                    Programs & Events
                  </button>
                  <button onClick={() => { scrollToSection('gallery'); setMegaMenuOpen(null); }} className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-gray-700 transition-colors">
                    Gallery
                  </button>
                </div>
              )}
            </div>

            <Link to="/blog" className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2">
              Blog
            </Link>

            <Link to="/resources" className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2">
              Resources
            </Link>
            
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2">
              Contact
            </button>
            
            <Button onClick={() => scrollToSection('contact')} className="bg-emerald-600 hover:bg-emerald-700 text-white ml-2">
              Join Us
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button 
                className="lg:hidden text-gray-700 hover:text-emerald-600 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <img 
                    src={logoImage} 
                    alt="MSSN UNILORIN Logo" 
                    className="h-12 w-auto object-contain"
                  />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation menu for MSSN UNILORIN website
                </SheetDescription>
              </SheetHeader>
              
              <nav className="flex flex-col gap-1 mt-8">
                <Link 
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                
                <Separator className="my-2" />
                
                <div className="px-4 py-2 text-sm text-gray-500">About</div>
                <button 
                  onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>Who We Are</span>
                </button>
                <button 
                  onClick={() => { scrollToSection('vision'); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <Target className="w-5 h-5" />
                  <span>Vision & Mission</span>
                </button>
                <button 
                  onClick={() => { scrollToSection('structure'); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Our Structure</span>
                </button>
                
                <Separator className="my-2" />
                
                <div className="px-4 py-2 text-sm text-gray-500">Programs</div>
                <button 
                  onClick={() => { scrollToSection('focus'); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <Lightbulb className="w-5 h-5" />
                  <span>Core Focus Areas</span>
                </button>
                <button 
                  onClick={() => { scrollToSection('programs'); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Programs & Events</span>
                </button>
                <button 
                  onClick={() => { scrollToSection('gallery'); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Gallery</span>
                </button>
                
                <Separator className="my-2" />
                
                <Link 
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Blog</span>
                </Link>
                <Link 
                  to="/resources"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Resources</span>
                </Link>
                <button 
                  onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact</span>
                </button>
                
                <Separator className="my-4" />
                
                <Button 
                  onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }} 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white w-full"
                >
                  Join Us
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
