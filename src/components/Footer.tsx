import { useLanguage } from "@/hooks/useLanguage";
import ragdollLogo from "@/assets/ragdoll-logo.png";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={ragdollLogo} 
              alt="My Pets Ragdoll Logo" 
              className="w-16 h-16 object-contain opacity-90"
            />
          </div>
          
          {/* Contact Information */}
          <div className="space-y-2">
            <p className="text-white/90 text-sm">
  {t('footer.address')}
            </p>
            <p className="text-white/90 text-sm">
              <a 
                href="tel:+359894474966" 
                className="hover:text-white transition-colors hover:underline"
              >
                +359894 474 966
              </a>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.facebook.com/Bleuroi.Ragdol.Cattery" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.tiktok.com/@blueroi.ragdol.cattery" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.15 20.1a6.34 6.34 0 0 0 10.86-4.43V7.93a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.19-.36z"/>
              </svg>
            </a>
          </div>

          {/* Copyright and Credits */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <p className="text-white/40 text-sm">
      {t('footer.copyright')}
            </p>
            <p className="text-white/60 text-sm">
              Website created by{' '}
              <a 
                href="https://automationaid.eu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 underline underline-offset-2 transition-colors font-medium"
              >
                AutomationAid.eu
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;