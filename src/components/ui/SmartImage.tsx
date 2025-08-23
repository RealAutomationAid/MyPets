import React, { useState, useEffect } from 'react';

interface SmartImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * SmartImage component with automatic fallback and loading animations
 * Perfect for ragdoll cat images with reliable fallback system
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  fallbackSrc = '/placeholder.svg',
  alt,
  className = '',
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      onError?.();
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`image-fade-in ${isLoaded ? 'loaded' : ''} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default SmartImage;