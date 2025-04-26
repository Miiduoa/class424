'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled
const MobileNav = dynamic(() => import('./MobileNav'), { ssr: false });

export default function NavClientWrapper() {
  return <MobileNav />;
} 