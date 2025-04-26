'use client';

import { useState, useEffect, ReactNode } from 'react';

/**
 * ClientOnly 組件
 * 確保內容只在客戶端渲染，解決水合(hydration)不匹配問題
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
} 