'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

/**
 * A wrapper component for Next.js Image that handles loading errors by showing a fallback image
 */
export default function ImageWithFallback({
  src,
  fallbackSrc = '/images/no-poster.svg',
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);

  // Handle poster URLs from omdbapi.com specifically
  useEffect(() => {
    if (imgSrc && imgSrc.includes('omdbapi.com')) {
      // Add cache-busting parameter and ensure HTTPS
      const secureUrl = imgSrc.replace(/^http:\/\//i, 'https://');
      if (!secureUrl.includes('?')) {
        setImgSrc(`${secureUrl}?t=${Date.now()}`);
      }
    }
  }, [imgSrc]);

  return (
    <>
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={() => {
          setError(true);
          setIsLoading(false);
          setImgSrc(fallbackSrc);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
        style={{
          ...props.style,
          display: isLoading ? 'none' : 'block',
        }}
      />
      
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      
      {error && imgSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">No Poster</span>
        </div>
      )}
    </>
  );
} 