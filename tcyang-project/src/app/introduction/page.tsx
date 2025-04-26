'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Introduction() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <header className={`text-center mb-12 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">個人簡介</span>
        </h1>
        <p className="text-[rgba(var(--foreground),0.8)] text-lg md:text-xl max-w-2xl mx-auto">這裡展示的是我的個人資料、學習歷程和專業技能</p>
      </header>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* 左側個人資料和照片 */}
        <div className={`md:w-1/3 transition-all duration-700 delay-200 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <div className="bg-[rgba(var(--background),1)] border border-[rgba(var(--border),0.5)] rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-6 flex justify-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[rgba(var(--primary),0.1)] shadow-lg">
                <Image 
                  src="https://i.imgur.com/6V5aIZq.png" 
                  alt="顧晉瑋個人照片" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-4">顧晉瑋</h2>
            <p className="text-center text-[rgba(var(--foreground),0.7)] mb-6">資訊管理系統開發者</p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="text-[rgb(var(--primary))] w-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <span className="ml-3">靜宜大學</span>
              </div>
              <div className="flex items-center">
                <div className="text-[rgb(var(--primary))] w-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="ml-3">miiduoa@icloud.com</span>
              </div>
              <div className="flex items-center">
                <div className="text-[rgb(var(--primary))] w-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="ml-3">0966198826</span>
              </div>
              <div className="flex items-center">
                <div className="text-[rgb(var(--primary))] w-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <a href="https://instagram.com/miiduoa" target="_blank" rel="noopener noreferrer" className="ml-3 hover:text-[rgb(var(--primary))]">
                  Instagram: @miiduoa
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-[rgba(var(--background),1)] border border-[rgba(var(--border),0.5)] rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">研究興趣</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))] rounded-full text-sm">人工智慧</span>
              <span className="px-3 py-1 bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))] rounded-full text-sm">資料分析</span>
              <span className="px-3 py-1 bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))] rounded-full text-sm">程式設計</span>
              <span className="px-3 py-1 bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))] rounded-full text-sm">系統分析</span>
              <span className="px-3 py-1 bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))] rounded-full text-sm">資料庫設計</span>
            </div>
          </div>
        </div>

        {/* 右側內容區 */}
        <div className={`md:w-2/3 transition-all duration-700 delay-300 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <div className="bg-[rgba(var(--background),1)] border border-[rgba(var(--border),0.5)] rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="flex border-b border-[rgba(var(--border),0.5)]">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'profile' ? 'text-[rgb(var(--primary))] border-b-2 border-[rgb(var(--primary))]' : 'text-[rgba(var(--foreground),0.7)] hover:text-[rgb(var(--foreground))]'}`}
              >
                關於我
              </button>
              <button 
                onClick={() => setActiveTab('skills')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'skills' ? 'text-[rgb(var(--primary))] border-b-2 border-[rgb(var(--primary))]' : 'text-[rgba(var(--foreground),0.7)] hover:text-[rgb(var(--foreground))]'}`}
              >
                專業技能
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'projects' ? 'text-[rgb(var(--primary))] border-b-2 border-[rgb(var(--primary))]' : 'text-[rgba(var(--foreground),0.7)] hover:text-[rgb(var(--foreground))]'}`}
              >
                專案經驗
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="animate-fadeIn">
                  <h3 className="text-xl font-bold mb-4">成長背景與學習歷程</h3>
                  <div className="space-y-4 text-[rgba(var(--foreground),0.8)]">
                    <p>
                      我是顧晉瑋，目前就讀於靜宜大學資訊管理學系二年級。從小我就對電腦和資訊科技充滿好奇心，高中時期參加了資訊社團，開始接觸程式設計和資料庫的基礎知識。高三時，我曾參與設計一個校內活動報名系統的小型專案，這次經驗讓我體會到資訊系統如何解決實際問題，也激發了我對資訊管理領域的興趣。
                    </p>
                    <p>
                      進入大學後，我積極學習資訊管理相關課程，包括程式設計、資料庫管理、系統分析與設計等。在「系統分析與設計」課程中，我與小組成員合作分析並設計了一個線上學習平台的原型，負責需求分析和系統架構設計，獲得了老師的高度評價。這次經驗讓我確信自己適合並熱愛系統分析的工作。
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-bold mt-6 mb-4">能力與專長</h3>
                  <p className="mb-4 text-[rgba(var(--foreground),0.8)]">在學習過程中，我發現自己在以下幾個方面具有優勢：</p>
                  <ul className="space-y-3 text-[rgba(var(--foreground),0.8)]">
                    <li className="flex items-start">
                      <span className="text-[rgb(var(--primary))] mr-2">✓</span>
                      <span><strong>系統思維</strong>：能夠從整體角度理解問題，並將複雜需求分解為可管理的部分</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[rgb(var(--primary))] mr-2">✓</span>
                      <span><strong>邏輯分析</strong>：擅長透過邏輯思考分析問題並提出解決方案</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[rgb(var(--primary))] mr-2">✓</span>
                      <span><strong>溝通協調</strong>：能夠有效與不同背景的人溝通，理解並整合多方需求</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[rgb(var(--primary))] mr-2">✓</span>
                      <span><strong>文件撰寫</strong>：在多個課程專案中負責撰寫需求文件和設計規格，獲得良好評價</span>
                    </li>
                  </ul>
                </div>
              )}
              
              {activeTab === 'skills' && (
                <div className="animate-fadeIn">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between">
                        <span className="font-medium">系統分析與設計</span>
                        <span className="text-[rgb(var(--primary))] font-medium">85%</span>
                      </div>
                      <div className="w-full bg-[rgba(var(--secondary),0.5)] rounded-full h-2.5 mt-2">
                        <div className="bg-[rgb(var(--primary))] h-2.5 rounded-full animate-growWidth" style={{width: "85%"}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="font-medium">資料庫設計與SQL</span>
                        <span className="text-[rgb(var(--primary))] font-medium">80%</span>
                      </div>
                      <div className="w-full bg-[rgba(var(--secondary),0.5)] rounded-full h-2.5 mt-2">
                        <div className="bg-[rgb(var(--primary))] h-2.5 rounded-full animate-growWidth" style={{width: "80%", animationDelay: "0.2s"}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="font-medium">程式設計 (Java)</span>
                        <span className="text-[rgb(var(--primary))] font-medium">75%</span>
                      </div>
                      <div className="w-full bg-[rgba(var(--secondary),0.5)] rounded-full h-2.5 mt-2">
                        <div className="bg-[rgb(var(--primary))] h-2.5 rounded-full animate-growWidth" style={{width: "75%", animationDelay: "0.4s"}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="font-medium">程式設計 (Python)</span>
                        <span className="text-[rgb(var(--primary))] font-medium">70%</span>
                      </div>
                      <div className="w-full bg-[rgba(var(--secondary),0.5)] rounded-full h-2.5 mt-2">
                        <div className="bg-[rgb(var(--primary))] h-2.5 rounded-full animate-growWidth" style={{width: "70%", animationDelay: "0.6s"}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="font-medium">專案管理</span>
                        <span className="text-[rgb(var(--primary))] font-medium">65%</span>
                      </div>
                      <div className="w-full bg-[rgba(var(--secondary),0.5)] rounded-full h-2.5 mt-2">
                        <div className="bg-[rgb(var(--primary))] h-2.5 rounded-full animate-growWidth" style={{width: "65%", animationDelay: "0.8s"}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="font-medium">UML與ERD建模</span>
                        <span className="text-[rgb(var(--primary))] font-medium">80%</span>
                      </div>
                      <div className="w-full bg-[rgba(var(--secondary),0.5)] rounded-full h-2.5 mt-2">
                        <div className="bg-[rgb(var(--primary))] h-2.5 rounded-full animate-growWidth" style={{width: "80%", animationDelay: "1s"}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'projects' && (
                <div className="animate-fadeIn space-y-8">
                  <div className="border-l-4 border-[rgb(var(--primary))] pl-4 pb-2">
                    <h3 className="text-xl font-bold mb-2">線上學習平台系統設計</h3>
                    <div className="flex items-center text-sm text-[rgba(var(--foreground),0.6)] mb-3">
                      <span className="mr-3">系統分析師、小組組長</span>
                      <span>2023年春季學期</span>
                    </div>
                    <p className="mb-3">在「系統分析與設計」課程中，帶領四人小組完成線上學習平台的需求分析和系統設計。</p>
                    <div className="mb-3">
                      <h4 className="font-medium mb-2">負責工作：</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>進行用戶訪談和需求收集</li>
                        <li>設計系統架構和數據模型</li>
                        <li>繪製UML圖表（用例圖、類別圖、活動圖等）</li>
                        <li>設計使用者介面原型</li>
                        <li>撰寫系統規格文件</li>
                      </ul>
                    </div>
                    <div className="bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))] p-3 rounded-md">
                      <strong>成果：</strong> 專案獲得課程最高評分，被老師推薦為優秀作品範例。
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-[rgb(var(--accent))] pl-4 pb-2">
                    <h3 className="text-xl font-bold mb-2">學生社團管理系統</h3>
                    <div className="flex items-center text-sm text-[rgba(var(--foreground),0.6)] mb-3">
                      <span className="mr-3">資料庫設計師、後端開發</span>
                      <span>2023年秋季學期</span>
                    </div>
                    <p className="mb-3">在「資料庫管理系統」課程中，與團隊合作開發學生社團活動管理系統。</p>
                    <div className="mb-3">
                      <h4 className="font-medium mb-2">負責工作：</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>設計資料庫結構和E-R模型</li>
                        <li>實作SQL查詢和資料庫功能</li>
                        <li>開發部分後端功能</li>
                        <li>系統測試和除錯</li>
                      </ul>
                    </div>
                    <div className="bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))] p-3 rounded-md">
                      <strong>成果：</strong> 成功開發出功能完整的系統雛形，能夠管理社團成員、活動和預算。
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className={`transition-all duration-700 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-lg font-medium text-gray-800 mb-4">我喜愛的電影</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="w-40 h-56 relative mb-3 rounded overflow-hidden">
                    <Image 
                      src="https://i.imgur.com/Og0PZIS.jpg" 
                      alt="超人電影海報" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-800">超人</h4>
                  <p className="text-sm text-gray-500">上映日期：2025/07/09</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="w-40 h-56 relative mb-3 rounded overflow-hidden">
                    <Image 
                      src="https://i.imgur.com/HbkCTRm.jpg" 
                      alt="驚奇4超人：第一步電影海報" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-800">驚奇4超人：第一步</h4>
                  <p className="text-sm text-gray-500">上映日期：待定</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/" className="btn btn-primary">
          返回首頁
        </Link>
      </div>
    </div>
  );
} 