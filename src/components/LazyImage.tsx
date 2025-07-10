import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  blurDataURL,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${btoa(`
    <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="30%" y="40%" width="40%" height="20%" fill="#e5e7eb" rx="4"/>
    </svg>
  `)}`;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      <img
        src={blurDataURL || defaultBlurDataURL}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(4px)' }}
        aria-hidden="true"
      />
      
      {/* Actual image */}
      {inView && (
        <img
          src={hasError ? '/placeholder-recipe.jpg' : src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      
      {/* Loading indicator */}
      {!isLoaded && !hasError && inView && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <span className="text-2xl block mb-2">🖼️</span>
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;