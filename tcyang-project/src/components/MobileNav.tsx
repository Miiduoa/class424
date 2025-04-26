'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  
  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative">
      {/* Hamburger button */}
      <button 
        className="md:hidden flex flex-col justify-center items-center h-10 w-10 focus:outline-none relative z-50" 
        onClick={toggleMenu}
        aria-label={isOpen ? "關閉選單" : "開啟選單"}
      >
        <span 
          className={`w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
            isOpen ? 'transform rotate-45 translate-y-1' : 'mb-1.5'
          }`} 
        />
        <span 
          className={`w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
            isOpen ? 'opacity-0' : 'mb-1.5'
          }`} 
        />
        <span 
          className={`w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
            isOpen ? 'transform -rotate-45 -translate-y-1' : ''
          }`} 
        />
      </button>
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}
      
      {/* Mobile menu */}
      <div 
        className={`fixed top-0 right-0 h-screen w-[280px] bg-white dark:bg-gray-900 shadow-2xl z-50 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col overflow-hidden`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <span className="text-xl font-bold">選單</span>
          <button 
            onClick={toggleMenu}
            className="h-10 w-10 flex items-center justify-center text-gray-600 hover:text-gray-900"
            aria-label="關閉選單"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1">
          <nav className="space-y-1">
            <MobileNavLink href="/" active={pathname === '/'}>首頁</MobileNavLink>
            <MobileNavLink href="/movie-imdb" active={pathname === '/movie-imdb'}>電影資料庫</MobileNavLink>
            <MobileNavLink href="/introduction" active={pathname === '/introduction'}>個人簡介</MobileNavLink>
            <MobileNavLink href="/form" active={pathname === '/form'}>聯絡表單</MobileNavLink>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-3 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">功能專區</h3>
              <MobileNavLink href="/movie-fetch" active={pathname === '/movie-fetch'}>即將上映電影</MobileNavLink>
              <MobileNavLink href="/teacher-search" active={pathname === '/teacher-search'}>教師資料查詢</MobileNavLink>
              <MobileNavLink href="/firestore" active={pathname === '/firestore'}>Firestore資料</MobileNavLink>
              <MobileNavLink href="/datetime" active={pathname === '/datetime'}>日期時間</MobileNavLink>
              <MobileNavLink href="/accident-search-same-page" active={pathname === '/accident-search-same-page'}>交通事故查詢</MobileNavLink>
            </div>
          </nav>
        </div>
        
        <div className="border-t border-gray-200 p-5">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} 顧晉瑋</p>
        </div>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
}

const MobileNavLink = ({ href, children, active }: NavLinkProps) => {
  return (
    <Link 
      href={href}
      className={`block px-3 py-2.5 rounded transition-colors ${
        active 
          ? 'bg-blue-50 font-medium text-blue-600'
          : 'hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center">
        <span className="flex-grow">{children}</span>
        {active && (
          <span className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
    </Link>
  );
}; 