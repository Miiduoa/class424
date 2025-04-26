'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  bgColor?: string;
  delay?: number;
}

const FeatureCard = ({ href, title, description, icon, bgColor = 'from-indigo-600 to-violet-600', delay = 0 }: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Link 
        href={href}
        className="group block h-full bg-white dark:bg-slate-800/60 rounded-2xl p-6 shadow-md hover:shadow-lg border border-slate-100 dark:border-slate-700/60 transition-all duration-300 relative overflow-hidden hover:-translate-y-1"
      >
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        
        {/* Subtle corner accent */}
        <div className={`absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br ${bgColor} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          {/* Icon with gradient background */}
          <div className="w-14 h-14 flex items-center justify-center text-2xl rounded-xl mb-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-sm border border-slate-100 dark:border-slate-700">
            {icon}
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white font-montserrat group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-300 mb-4">{description}</p>
          
          <div className="flex justify-end mt-2">
            <span className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
              前往查看
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeatureCard; 