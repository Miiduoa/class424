'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MoviePosterProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
}

/**
 * A specialized component for displaying movie posters with proper error handling
 */
export default function MoviePoster({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  fill = false,
}: MoviePosterProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pre-process and validate the image URL
  useEffect(() => {
    console.log(`MoviePoster: Original URL: ${src}`);
    
    if (!src || src === 'N/A') {
      console.log(`MoviePoster: Invalid source URL for ${alt}, showing fallback`);
      setImgSrc(null);
      setError(true);
      setLoading(false);
      return;
    }

    let processedSrc = src;
    // Ensure HTTPS is used instead of HTTP
    if (processedSrc.startsWith('http:')) {
      console.log(`MoviePoster: Converting HTTP to HTTPS for ${processedSrc}`);
      processedSrc = processedSrc.replace(/^http:/i, 'https:');
    }
    
    // Add a cache-busting parameter if from OMDB API
    if (processedSrc.includes('omdbapi.com') && !processedSrc.includes('?')) {
      console.log(`MoviePoster: Adding cache-busting to OMDB URL ${processedSrc}`);
      processedSrc = `${processedSrc}?t=${Date.now()}`;
    }
    
    console.log(`MoviePoster: Final processed URL: ${processedSrc}`);
    setImgSrc(processedSrc);
    setLoading(true);
    setError(false);
  }, [src, alt]);

  // Try loading the image directly in a browser fetch to test it
  useEffect(() => {
    if (!imgSrc) return;
    
    // Test the image URL with a direct fetch
    fetch(imgSrc, { method: 'HEAD' })
      .then(response => {
        console.log(`MoviePoster: Fetch test for ${imgSrc} - Status: ${response.status}, OK: ${response.ok}`);
        if (!response.ok) {
          console.error(`MoviePoster: Image fetch failed with status ${response.status}`);
          setError(true);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(`MoviePoster: Fetch test error for ${imgSrc}:`, err);
      });
  }, [imgSrc]);

  // Loading and error fallback JSX
  const loadingFallback = (
    <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`} 
         style={fill ? { position: 'absolute', inset: 0 } : { width, height }}>
      <span className="sr-only">Loading image...</span>
      <span className="text-gray-400 text-sm">Loading...</span>
    </div>
  );

  const errorFallback = (
    <div className={`bg-gray-100 flex items-center justify-center ${className}`}
         style={fill ? { position: 'absolute', inset: 0 } : { width, height }}>
      <div className="text-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 text-sm">No Poster</p>
      </div>
    </div>
  );

  // If we have no valid image, show error state
  if (!imgSrc) {
    return errorFallback;
  }

  return (
    <>
      {loading && loadingFallback}
      
      <div style={{ display: loading ? 'none' : 'block', position: fill ? 'relative' : 'static', width: fill ? '100%' : width, height: fill ? '100%' : height }}>
        <Image
          src={imgSrc}
          alt={alt}
          className={className}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          priority={priority}
          fill={fill}
          unoptimized={true}
          onLoad={() => {
            console.log(`MoviePoster: Image loaded successfully: ${imgSrc}`);
            setLoading(false);
          }}
          onError={() => {
            console.error(`MoviePoster: Image load error: ${imgSrc}`);
            setError(true);
            setLoading(false);
          }}
          style={{ display: error ? 'none' : 'block', objectFit: 'cover' }}
        />
        {error && errorFallback}
      </div>
    </>
  );
} 