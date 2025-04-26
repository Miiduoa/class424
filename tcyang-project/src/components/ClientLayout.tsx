'use client';

import Providers from "./Providers";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <header className="site-header w-full py-4">
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
            <div className="flex-none py-2">
              <Link href="/" className="text-2xl font-bold block">
                顧晉瑋 ANDY KU
              </Link>
            </div>
            <MobileNav />
          </div>
        </header>
        <div className="w-full h-4"></div> {/* Spacing to prevent overlaps */}
        <main className="flex-grow w-full overflow-x-hidden pt-4">
          <div className="container mx-auto px-4 w-full">
            {children}
          </div>
        </main>
        <footer className="bg-slate-800 text-white py-8 mt-12 w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">顧晉瑋 ANDY KU</h3>
                <p className="mb-2">網站製作 | Teaching | 系統開發</p>
                <p>Made with ♥ and Next.js</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">相關連結</h3>
                <ul>
                  <li className="mb-2">
                    <Link href="/works" className="hover:text-blue-300 transition">
                      專案作品
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/form" className="hover:text-blue-300 transition">
                      聯絡表單
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/form-result" className="hover:text-blue-300 transition">
                      表單結果
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">聯絡方式</h3>
                <div className="flex items-center mb-2">
                  <FaEnvelope className="mr-2" />
                  <a href="mailto:example@email.com" className="hover:text-blue-300 transition">
                    example@email.com
                  </a>
                </div>
                <div className="flex items-center mb-2">
                  <FaPhone className="mr-2" />
                  <a href="tel:+886912345678" className="hover:text-blue-300 transition">
                    +886 912-345-678
                  </a>
                </div>
                <div className="flex space-x-4 mt-4">
                  <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-blue-300 transition">
                    <FaGithub size={24} />
                  </a>
                  <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-300 transition">
                    <FaLinkedin size={24} />
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center pt-8 mt-8 border-t border-gray-700">
              <p>© {new Date().getFullYear()} Andy Ku. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Providers>
  );
} 