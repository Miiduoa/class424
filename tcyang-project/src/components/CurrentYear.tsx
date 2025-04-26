'use client';

import { useState, useEffect } from 'react';

export default function CurrentYear() {
  const [year, setYear] = useState<string>('');
  
  useEffect(() => {
    // 在客戶端更新年份
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);
  }, []);
  
  return <span suppressHydrationWarning>{year}</span>;
} 