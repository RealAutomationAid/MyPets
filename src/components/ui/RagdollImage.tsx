import React, { useState } from 'react';

interface RagdollImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

const RagdollImage: React.FC<RagdollImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder.svg',
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = () => {
    if (!hasErrored && currentSrc !== fallbackSrc) {
      setHasErrored(true);
      setCurrentSrc(fallbackSrc);
      onError?.();
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default RagdollImage;