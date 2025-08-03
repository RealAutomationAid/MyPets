import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useLocation } from "react-router-dom";
import { useSocialMediaSettings } from "@/services/convexSiteSettingsService";
import { Share2, X } from "lucide-react";

const SocialSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const socialSettings = useSocialMediaSettings();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleThemeToggle = () => {
    // Don't allow theme toggle on admin routes
    if (isAdminRoute) {
      return;
    }
    toggleTheme();
  };

  // Get URLs from settings or use fallback defaults
  const facebookUrl = socialSettings?.facebook_url || 'https://www.facebook.com/profile.php?id=61561853557367';
  const tiktokUrl = socialSettings?.tiktok_url || 'https://www.tiktok.com/@bleuroi_ragdoll?is_from_webapp=1&sender_device=pc';
  const instagramUrl = socialSettings?.instagram_url;

  const SocialLinks = ({ mobile = false }) => (
    <>
      {/* Facebook Link */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block ${mobile ? 'w-10 h-10' : 'w-12 h-12'} bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors group hover:scale-110 transform duration-200`}
      >
        <svg
          className={mobile ? "w-5 h-5" : "w-6 h-6"}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>

      {/* Instagram Link - Only show if URL is configured */}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block ${mobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white hover:from-purple-700 hover:to-pink-700 transition-colors group hover:scale-110 transform duration-200`}
        >
          <svg
            className={mobile ? "w-5 h-5" : "w-6 h-6"}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      )}

      {/* TikTok Link */}
      <a
        href={tiktokUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block ${mobile ? 'w-10 h-10' : 'w-12 h-12'} bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors group hover:scale-110 transform duration-200`}
      >
        <svg
          className={mobile ? "w-5 h-5" : "w-6 h-6"}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.15 20.1a6.34 6.34 0 0 0 10.86-4.43V7.93a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.19-.36z"/>
        </svg>
      </a>

      {/* Theme Toggle - Hidden on admin pages */}
      {!isAdminRoute && (
        <button
          onClick={handleThemeToggle}
          className={`block ${mobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group hover:scale-110 transform duration-200`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg
              className={mobile ? "w-4 h-4" : "w-5 h-5"}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
            </svg>
          ) : (
            <svg
              className={mobile ? "w-4 h-4" : "w-5 h-5"}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
            </svg>
          )}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop/Tablet Sidebar (hidden on mobile) */}
      <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 hover:scale-105">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-4 space-y-4">
          <SocialLinks />
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-4 z-40">
        {/* Expanded Menu */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-3 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
            <SocialLinks mobile={true} />
          </div>
        )}
        
        {/* FAB Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 active:scale-95"
          aria-label={isExpanded ? "Close social menu" : "Open social menu"}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <Share2 className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default SocialSidebar;