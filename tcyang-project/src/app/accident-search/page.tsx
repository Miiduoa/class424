'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiArrowLeft, FiInfo } from 'react-icons/fi';

export default function AccidentSearch() {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      setError('請輸入搜尋關鍵字');
      return;
    }
    
    // 清除錯誤
    setError('');
    
    // 導向結果頁面，將關鍵字作為參數傳遞
    router.push(`/accident-search-result?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            返回首頁
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-white text-2xl font-bold">交通事故資料搜尋</h1>
          </div>
          
          <div className="p-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiInfo className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    請輸入關鍵字搜尋114年1月台中十大易肇事路口資料，例如：台中、西屯、北區等。
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                  搜尋關鍵字
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="keyword"
                    className={`block w-full pr-10 focus:outline-none sm:text-sm rounded-md py-2 px-3 border ${
                      error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="請輸入地區、路名或其他關鍵字"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiSearch className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'}`} aria-hidden="true" />
                  </div>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600" id="keyword-error">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiSearch className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                  搜尋
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>本搜尋系統提供台中市交通事故資料查詢，資料來源為台中市政府開放資料平台。</p>
          <p className="mt-1">若需更詳細的資訊，請參考<a href="https://data.gov.tw/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">政府資料開放平台</a>。</p>
        </div>
      </div>
    </div>
  );
} 