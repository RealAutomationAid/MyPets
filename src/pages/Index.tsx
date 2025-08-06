import { useState, useEffect } from "react";
import ModernNavigation from "@/components/ModernNavigation";
import CinematicVideoHero from "@/components/CinematicVideoHero";
import FeaturedModelsSection from "@/components/FeaturedModelsSection";
import BusinessGallery from "@/components/BusinessGallery";
import AwardsSection from "@/components/AwardsSection";
import NewsSection from "@/components/NewsSection";
import TikTokSection from "@/components/TikTokSection";
import Footer from "@/components/Footer";
import SocialSidebar from "@/components/SocialSidebar";

import CatCarePopup from "@/components/CatCarePopup";
import BackgroundAnimations from "@/components/BackgroundAnimations";

const Index = () => {

  const [showCatCarePopup, setShowCatCarePopup] = useState(false);

  useEffect(() => {
    // Show cat care popup after 3 seconds
    const timer = setTimeout(() => {
      setShowCatCarePopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundAnimations />
      
      {/* Navigation overlaid on video */}
      <ModernNavigation />
      
      <div className="relative">
        <div id="home">
          <CinematicVideoHero />
        </div>
      <div id="models">
        <FeaturedModelsSection />
      </div>
      <div id="gallery">
        <BusinessGallery />
      </div>
      <div id="awards">
        <AwardsSection />
      </div>
      <div id="news">
        <NewsSection />
      </div>
      <div id="tiktok">
        <TikTokSection />
      </div>
      <div id="contact">
        <Footer />
      </div>
      
      {/* Sticky Social Sidebar */}
      <SocialSidebar />
      
      
      {/* Cat Care Responsibility Popup */}
      {showCatCarePopup && (
        <CatCarePopup 
          onClose={() => setShowCatCarePopup(false)}
        />
      )}
      </div>
    </div>
  );
};

export default Index;
