import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">歡迎來到課程專案</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link 
          href="/form" 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">表單頁面</h2>
          <p>前往表單頁面</p>
        </Link>
        <Link 
          href="/traffic-accident-analysis" 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">交通事故分析</h2>
          <p>前往交通事故分析頁面</p>
        </Link>
      </div>
    </div>
  );
} 