'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { CSSProperties } from 'react';

interface SimplePosterProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  fit?: 'cover' | 'contain';
  maxSize?: number;
  maxHeight?: number;
}

/**
 * A specialized component for displaying movie posters with proper error handling
 */
const SimplePoster: React.FC<SimplePosterProps> = ({
  src,
  alt,
  className = '',
  style = {},
  fit = 'cover',
  maxSize,
  maxHeight,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setImgSrc(src);
    setLoading(true);
    setError(false);

    // Preload image
    const img = new window.Image();
    img.src = src;
    
    img.onload = () => {
      setLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setLoading(false);
      setImgSrc('/images/movie-placeholder.png');
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const containerStyles: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
  };

  const imageStyles: CSSProperties = {
    objectFit: fit,
    width: '100%',
    height: '100%',
    maxWidth: maxSize ? `${maxSize}px` : 'none',
    maxHeight: maxHeight ? `${maxHeight}px` : 'none',
  };

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-[rgba(var(--secondary),0.2)] ${className}`} 
        style={containerStyles}
      >
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className={`simple-poster ${className}`} 
      style={containerStyles}
    >
      <img 
        src={imgSrc}
        alt={alt}
        style={imageStyles}
        loading="lazy"
        className={`transition-opacity duration-300 ${error ? 'opacity-60' : 'opacity-100'}`}
      />
    </div>
  );
};

export default SimplePoster; 