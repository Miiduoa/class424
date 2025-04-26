'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 動態導入 GMScriptInitializer
const GMScriptInitializer = dynamic(
  () => import('./GMScriptInitializer')
);

export default function Providers({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <>
      {isClient && <GMScriptInitializer />}
      {children}
    </>
  );
} 