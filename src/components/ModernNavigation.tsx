import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useActiveSection, useScrollPosition } from "@/hooks/useScrollAnimation";
import SocialContactModal from "./SocialContactModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import ragdollLogo from "@/assets/ragdoll-logo.png";

const ModernNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = useActiveSection(['home', 'models', 'males', 'females', 'kittens', 'tiktok', 'contact']);
  const { scrollY } = useScrollPosition();
  const { t } = useLanguage();
  
  const isNewsPage = location.pathname.startsWith('/news');
  const isAboutPage = location.pathname.startsWith('/about');
  const isHomePage = location.pathname === '/';

  const scrollToSection = useCallback((sectionId: string) => {
    if (isHomePage) {
      // If we're on the home page, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home first then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsOpen(false);
  }, [isHomePage, navigate]);

  const navBg = scrollY > 50 ? 'bg-background/98' : 'bg-black/30';
  const navShadow = scrollY > 50 ? 'shadow-lg' : '';
  const textColor = scrollY > 50 ? 'text-foreground' : 'text-white';
  
  // Calculate scroll progress
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = Math.min((scrollY / documentHeight) * 100, 100);

  return (
    <nav className={`${navBg} ${navShadow} backdrop-blur-sm fixed top-0 w-full z-50 transition-all duration-300 relative`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src={ragdollLogo} 
              alt="My Pets Ragdoll Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className={`transition-colors text-sm font-medium ${
                activeSection === 'home' 
                  ? `${textColor} border-b-2 ${scrollY > 50 ? 'border-foreground' : 'border-white'}` 
                  : `${scrollY > 50 ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`
              }`}
            >
              {t('navigation.home')}
            </button>
            <button 
              onClick={() => scrollToSection('models')}
              className={`transition-colors text-sm font-medium ${
                activeSection === 'models' 
                  ? `${textColor} border-b-2 ${scrollY > 50 ? 'border-foreground' : 'border-white'}` 
                  : `${scrollY > 50 ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`
              }`}
            >
              {t('navigation.models')}
            </button>
            <button 
              onClick={() => scrollToSection('males')}
              className={`transition-colors text-sm font-medium ${
                activeSection === 'males' 
                  ? `${textColor} border-b-2 ${scrollY > 50 ? 'border-foreground' : 'border-white'}` 
                  : `${scrollY > 50 ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`
              }`}
            >
              {t('navigation.males')}
            </button>
            <button 
              onClick={() => scrollToSection('females')}
              className={`transition-colors text-sm font-medium ${
                activeSection === 'females' 
                  ? `${textColor} border-b-2 ${scrollY > 50 ? 'border-foreground' : 'border-white'}` 
                  : `${scrollY > 50 ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`
              }`}
            >
              {t('navigation.females')}
            </button>
            <button 
              onClick={() => scrollToSection('kittens')}
              className={`transition-colors text-sm font-medium ${
                activeSection === 'kittens' 
                  ? `${textColor} border-b-2 ${scrollY > 50 ? 'border-foreground' : 'border-white'}` 
                  : `${scrollY > 50 ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`
              }`}
            >
              {t('navigation.kittens')}
            </button>
            <Link 
              to="/news"
              className={`transition-colors text-sm font-medium ${
                isNewsPage 
                  ? `${textColor} border-b-2 ${scrollY > 50 ? 'border-foreground' : 'border-white'}` 
                  : `${scrollY > 50 ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`
              }`}
            >
              {t('navigation.news')}
            </Link>
            <Link 
              to="/about"
              className={`transition-colors text-sm font-medium ${
                isAboutPage 
                  ? `${textColor} border-b-2 ${scrollY > 50 ? 'border-foreground' : 'border-white'}` 
                  : `${scrollY > 50 ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`
              }`}
            >
              За нас
            </Link>
            <button 
              onClick={() => scrollToSection('tiktok')}
              className={`transition-colors text-sm font-medium ${
                activeSection === 'tiktok' 
                  ? `${textColor} border-b-2 ${scrollY > 50 ? 'border-foreground' : 'border-white'}` 
                  : `${scrollY > 50 ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`
              }`}
            >
              {t('navigation.tiktok')}
            </button>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            <Button 
              variant="outline" 
              size="sm" 
              className={scrollY > 50 
                ? "bg-card border-border text-foreground hover:bg-muted" 
                : "bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              }
              onClick={() => setIsContactModalOpen(true)}
            >
              {t('navigation.contact')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColor} ${scrollY > 50 ? 'hover:text-muted-foreground' : 'hover:text-white/80'} focus:outline-none transition-colors`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2">
              <button 
                onClick={() => scrollToSection('home')}
                className={`block px-3 py-2 transition-colors text-sm w-full text-left ${
                  activeSection === 'home' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('navigation.home')}
              </button>
              <button 
                onClick={() => scrollToSection('models')}
                className={`block px-3 py-2 transition-colors text-sm w-full text-left ${
                  activeSection === 'models' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('navigation.models')}
              </button>
              <button 
                onClick={() => scrollToSection('males')}
                className={`block px-3 py-2 transition-colors text-sm w-full text-left ${
                  activeSection === 'males' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('navigation.males')}
              </button>
              <button 
                onClick={() => scrollToSection('females')}
                className={`block px-3 py-2 transition-colors text-sm w-full text-left ${
                  activeSection === 'females' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('navigation.females')}
              </button>
              <button 
                onClick={() => scrollToSection('kittens')}
                className={`block px-3 py-2 transition-colors text-sm w-full text-left ${
                  activeSection === 'kittens' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('navigation.kittens')}
              </button>
              <Link 
                to="/news"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 transition-colors text-sm w-full text-left ${
                  isNewsPage ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('navigation.news')}
              </Link>
              <Link 
                to="/about"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 transition-colors text-sm w-full text-left ${
                  isAboutPage ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                За нас
              </Link>
              <button 
                onClick={() => scrollToSection('tiktok')}
                className={`block px-3 py-2 transition-colors text-sm w-full text-left ${
                  activeSection === 'tiktok' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('navigation.tiktok')}
              </button>
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              
              <div className="px-3 py-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-primary border-primary text-primary-foreground hover:bg-primary/90 hover:border-primary/90"
                  onClick={() => {
                    setIsContactModalOpen(true);
                    setIsOpen(false);
                  }}
                >
                  {t('navigation.contact')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200">
        <div 
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Contact Modal */}
      <SocialContactModal
        cat={null}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </nav>
  );
};

export default ModernNavigation;