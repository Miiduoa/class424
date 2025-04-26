'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-600">載入中...</p>
      </div>
    </div>
  );
}

function FormResultContent() {
  const searchParams = useSearchParams();
  
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const subject = searchParams.get('subject') || '';
  const message = searchParams.get('message') || '';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">表單提交成功</h1>
        <div className="h-1 w-16 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          感謝您的提交！我們已收到您的資料，以下是您提供的資訊摘要
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center">
          <span className="inline-block w-2 h-6 bg-blue-600 mr-3"></span>
          <h2 className="text-xl font-semibold text-gray-800">您提交的資料</h2>
        </div>
        
        <div className="p-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm font-medium text-gray-700">姓名</dt>
              <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-3 break-words">{name}</dd>
            </div>
            
            <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm font-medium text-gray-700">Email</dt>
              <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-3 break-words">
                <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                  {email}
                </a>
              </dd>
            </div>
            
            <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm font-medium text-gray-700">主旨</dt>
              <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-3 break-words">{subject}</dd>
            </div>
            
            <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm font-medium text-gray-700">留言</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-3">
                <div className="bg-blue-50 p-4 rounded-md text-base text-gray-900 whitespace-pre-wrap break-words border border-gray-200">
                  {message}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center">
          <span className="inline-block w-2 h-6 bg-blue-600 mr-3"></span>
          <h2 className="text-xl font-semibold text-gray-800">後續處理流程</h2>
        </div>
        
        <div className="p-6">
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base text-gray-600">
                我們已收到您的表單資料，通常會在<span className="font-medium text-blue-600">1-2個工作日</span>內回覆您的訊息。
              </p>
            </div>
          </div>
          
          <div className="flex mt-4">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base text-gray-600">
                如有緊急需求，可以直接寄信至 <a href="mailto:miiduoa@icloud.com" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">miiduoa@icloud.com</a> 聯繫我們。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/form" 
          className="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回表單
        </Link>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          回首頁
        </Link>
      </div>
    </div>
  );
}

export default function FormResult() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Suspense fallback={<Loading />}>
        <FormResultContent />
      </Suspense>
    </div>
  );
} 