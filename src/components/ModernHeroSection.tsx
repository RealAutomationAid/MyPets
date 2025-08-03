import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContainerTextFlipDemo from "@/components/ui/container-text-flip-demo";
import featuredCat1 from "@/assets/featured-cat-1.jpg";
import featuredCat2 from "@/assets/featured-cat-2.jpg";
import { useScrollAnimation, useParallax } from "@/hooks/useScrollAnimation";
import modelCat1 from '@/assets/model-cat-1.jpg';
import modelCat2 from '@/assets/model-cat-2.jpg';
import modelCat3 from '@/assets/model-cat-3.jpg';
import SocialContactModal from "./SocialContactModal";
import HeroImageCarousel from "./HeroImageCarousel";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const ModernHeroSection = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2);
  const { elementRef: textRef, isVisible: textVisible } = useScrollAnimation(0.3);
  const { elementRef: photosRef, isVisible: photosVisible } = useScrollAnimation(0.1);
  const { elementRef: parallaxRef, offset: parallaxOffset } = useParallax(0.3);
  const { t } = useLanguage();
  
  // Get active hero images from database
  const heroImages = useQuery(api.heroImages.getActiveHeroImages) || [];
  
  // Fallback images for when no hero images are uploaded
  const fallbackImages = [
    { src: featuredCat1, alt: "OLIVIA", name: "OLIVIA", subtitle: "CHAT NOIR ELEGANCE" },
    { src: featuredCat2, alt: "MIA", name: "MIA", subtitle: "NOIR" },
    { src: modelCat1, alt: "BUBBLE", name: "BUBBLE", subtitle: "SILLY CAT" },
    { src: modelCat2, alt: "ZIGGY", name: "ZIGGY", subtitle: "SILLY CAT" },
    { src: modelCat3, alt: "MOMO", name: "MOMO", subtitle: "SILLY CAT" },
  ];
  
  // Use uploaded hero images if available, otherwise use fallback
  const displayImages = heroImages.length > 0 ? heroImages : fallbackImages;

  return (
    <section className="min-h-[85vh] flex items-center justify-center py-10 md:py-20 bg-background relative overflow-hidden">
      <div ref={heroRef} className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Hero Image Carousel - First on mobile */}
          <div 
            ref={photosRef}
            className={`relative flex justify-center items-center order-1 lg:order-2 transition-all duration-1000 ${
              photosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative w-full max-w-md">
              {/* Main Image Carousel */}
              <HeroImageCarousel 
                images={displayImages}
                autoPlay={true}
                autoPlayInterval={6000}
              />
              
              {/* Logo positioned bottom-left with subtle styling */}
              <div className="absolute -bottom-6 -left-6 bg-card/90 rounded-full p-4 shadow-lg backdrop-blur-sm border border-border/50 animate-float z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                  <img 
                    src="/radanov-pride-logo.png" 
                    alt="BleuRoi Ragdoll Cattery Logo" 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content - Second on mobile */}
          <div 
            ref={textRef} 
            className={`space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1 transition-all duration-1000 ${
              textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="space-y-4 md:space-y-6">
              <div className="font-playfair text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-foreground leading-tight">
                <div className="animate-fade-in-left">
                  <ContainerTextFlipDemo />
                </div>
                <span className="block border-l-4 border-foreground pl-4 md:pl-6 ml-0 font-normal mt-3 md:mt-4 animate-fade-in-left animate-delay-200">
                  {t('hero.mainTitle')}
                </span>
                <span className="block text-2xl md:text-4xl lg:text-5xl xl:text-6xl mt-3 md:mt-4 font-light text-muted-foreground animate-fade-in-left animate-delay-300">
                  {t('hero.subtitle')}
                </span>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <button 
                className="modern-hero-button group relative px-8 md:px-12 py-4 md:py-5 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 animate-fade-in-up animate-delay-400 border border-white/20 backdrop-blur-sm"
                onClick={() => setIsContactModalOpen(true)}
              >
                {/* Animated background layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-70 transition-all duration-700 animate-pulse"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out"></div>
                
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-50 blur-lg transition-all duration-500 group-hover:animate-pulse"></div>
                
                {/* Button content */}
                <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold tracking-wide uppercase">
                  {t('hero.ctaButton')}
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 bg-white/20 scale-0 group-active:scale-100 transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Hanging Cat Animation */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 delay-500 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="hanging-cat-animation">
            <div className="all-wrap">  
              <div className="all">
                <div className="yarn"></div>
                <div className="cat-wrap">    
                  <div className="cat">
                    <div className="cat-upper">
                      <div className="cat-leg"></div>
                      <div className="cat-leg"></div>
                      <div className="cat-head">
                        <div className="cat-ears">
                          <div className="cat-ear"></div>
                          <div className="cat-ear"></div>
                        </div>
                        <div className="cat-face">
                          <div className="cat-eyes"></div>
                          <div className="cat-mouth"></div>
                          <div className="cat-whiskers"></div>
                        </div>
                      </div>
                    </div>
                    <div className="cat-lower-wrap">
                      <div className="cat-lower">
                        <div className="cat-leg">
                          <div className="cat-leg">
                            <div className="cat-leg">
                              <div className="cat-leg">
                                <div className="cat-leg">
                                  <div className="cat-leg">
                                    <div className="cat-leg">
                                      <div className="cat-leg">
                                        <div className="cat-leg">
                                          <div className="cat-leg">
                                            <div className="cat-leg">
                                              <div className="cat-leg">
                                                <div className="cat-leg">
                                                  <div className="cat-leg">
                                                    <div className="cat-leg">
                                                      <div className="cat-leg">
                                                        <div className="cat-paw"></div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="cat-leg">
                          <div className="cat-leg">
                            <div className="cat-leg">
                              <div className="cat-leg">
                                <div className="cat-leg">
                                  <div className="cat-leg">
                                    <div className="cat-leg">
                                      <div className="cat-leg">
                                        <div className="cat-leg">
                                          <div className="cat-leg">
                                            <div className="cat-leg">
                                              <div className="cat-leg">
                                                <div className="cat-leg">
                                                  <div className="cat-leg">
                                                    <div className="cat-leg">
                                                      <div className="cat-leg">
                                                        <div className="cat-paw"></div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="cat-tail">
                          <div className="cat-tail">
                            <div className="cat-tail">
                              <div className="cat-tail">
                                <div className="cat-tail">
                                  <div className="cat-tail">
                                    <div className="cat-tail">
                                      <div className="cat-tail">
                                        <div className="cat-tail">
                                          <div className="cat-tail">
                                            <div className="cat-tail">
                                              <div className="cat-tail">
                                                <div className="cat-tail">
                                                  <div className="cat-tail">
                                                    <div className="cat-tail">
                                                      <div className="cat-tail -end"></div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom separator */}
        <div 
          className={`text-center mt-12 transition-all duration-1000 delay-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-px bg-muted-foreground/30"></div>
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
            <div className="w-12 h-px bg-muted-foreground/30"></div>
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      <SocialContactModal
        cat={null}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
};

export default ModernHeroSection;