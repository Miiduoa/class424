'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to prevent hydration errors
const CurrentYear = dynamic(() => import('./CurrentYear'), { ssr: false });

export default function CurrentYearWrapper() {
  return <CurrentYear />;
} 