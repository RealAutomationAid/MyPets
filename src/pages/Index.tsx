import { useState, useEffect } from "react";
import ModernNavigation from "@/components/ModernNavigation";
import HeroSection from "@/components/hero-section";
import FeaturedModelsSection from "@/components/FeaturedModelsSection";
import AnimatedCarouselGallery from "@/components/AnimatedCarouselGallery";
import NewsSection from "@/components/NewsSection";
import TikTokSection from "@/components/TikTokSection";
import Footer from "@/components/Footer";
import SocialSidebar from "@/components/SocialSidebar";
import SocialContactModal from "@/components/SocialContactModal";
import CatCarePopup from "@/components/CatCarePopup";
import BackgroundAnimations from "@/components/BackgroundAnimations";

const Index = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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
      <div className="relative z-10">
        <ModernNavigation />
      <div id="home">
        <HeroSection onContactClick={() => setIsContactModalOpen(true)} />
      </div>
      <div id="models">
        <FeaturedModelsSection />
      </div>
      <div id="gallery">
        <AnimatedCarouselGallery />
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
      
      {/* Contact Modal */}
      <SocialContactModal 
        cat={null}
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      
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
