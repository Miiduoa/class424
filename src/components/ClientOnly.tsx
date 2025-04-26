'use client';

import { useState, useEffect, ReactNode } from 'react';

/**
 * ClientOnly 組件
 * 用於包裹只應該在客戶端渲染的內容，避免服務器端與客戶端渲染不一致導致的hydration錯誤
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 在客戶端渲染前不顯示任何內容
  if (!hasMounted) {
    return null;
  }

  // 一旦客戶端渲染完成，顯示子組件
  return <>{children}</>;
} 