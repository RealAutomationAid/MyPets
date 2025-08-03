import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroImage {
  src: string;
  alt: string;
  name?: string;
  subtitle?: string;
}

interface HeroImageCarouselProps {
  images: HeroImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const HeroImageCarousel = ({ 
  images, 
  autoPlay = false, 
  autoPlayInterval = 5000 
}: HeroImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isHovered, images.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
    setIsLoading(false);
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 md:h-80 lg:h-96 bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div 
      className="relative w-full max-w-md mx-auto group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-xl shadow-2xl bg-card"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-xl">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {/* Image Error State */}
          {imageErrors.has(currentIndex) ? (
            <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Image unavailable</p>
                <p className="text-xs">{currentImage.alt}</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                loading={currentIndex === 0 ? "eager" : "lazy"}
                onLoad={handleImageLoad}
                onError={() => handleImageError(currentIndex)}
              />
              
              {/* Image overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              
              {/* Image info overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-lg leading-tight drop-shadow-lg">
                  {currentImage.name || currentImage.alt}
                </h3>
                {currentImage.subtitle && (
                  <p className="text-sm text-white/90 uppercase tracking-wide drop-shadow">
                    {currentImage.subtitle}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Navigation Arrows - Desktop Only */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hidden sm:flex"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hidden sm:flex"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-1 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full ${
                index === currentIndex ? 'scale-110' : 'hover:scale-105'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary shadow-lg'
                    : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                }`}
              />
              <span className="sr-only">
                {index === currentIndex ? 'Current image' : `Go to image ${index + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default HeroImageCarousel;