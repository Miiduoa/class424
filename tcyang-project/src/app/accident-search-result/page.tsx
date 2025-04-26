'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSearch, FiAlertTriangle, FiMapPin, FiCalendar, FiInfo, FiExternalLink, FiChevronLeft, FiHome } from 'react-icons/fi';
import { searchAccidentData } from '@/services/opendata';
import { Accident } from '@/types';
import ClientOnly from '@/components/ClientOnly';

function AccidentSearchResultContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get('keyword') || '';
  
  const [results, setResults] = useState<Accident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await searchAccidentData(keyword);
        if (isMounted) {
          setResults(data);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError('搜尋資料時發生錯誤');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (keyword) {
      fetchData();
    } else {
      setError('未提供搜尋關鍵字');
      setIsLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [keyword]);

  // 根據嚴重性取得對應的顏色類別
  const getSeverityClass = (severity: string): string => {
    switch (severity) {
      case '輕傷':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case '重傷':
        return 'bg-orange-100 text-orange-800 border-orange-500';
      case '死亡':
        return 'bg-red-100 text-red-800 border-red-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  // 計算整體風險等級
  const calculateRiskLevel = (accident: Accident): { level: string, class: string, icon: React.ReactNode } => {
    // 基於事故資料的各種因素判斷風險等級
    const severityFactor = accident.severity === '死亡' ? 3 : accident.severity === '重傷' ? 2 : 1;
    const frequencyFactor = accident.count > 5 ? 3 : accident.count > 2 ? 2 : 1;
    
    const riskScore = severityFactor * frequencyFactor;
    
    if (riskScore >= 6) {
      return { 
        level: '高', 
        class: 'bg-red-100 text-red-800 border-red-500',
        icon: <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5 inline-block"></span>
      };
    } else if (riskScore >= 3) {
      return { 
        level: '中', 
        class: 'bg-yellow-100 text-yellow-800 border-yellow-500',
        icon: <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5 inline-block"></span>
      };
    } else {
      return { 
        level: '低', 
        class: 'bg-green-100 text-green-800 border-green-500',
        icon: <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 inline-block"></span>
      };
    }
  };

  // 根據事故數量排序結果
  const sortedResults = results.length > 0 ? [...results].sort((a, b) => b.count - a.count) : [];

  // 計算整體風險狀況
  const getOverallRiskLevel = () => {
    if (results.length === 0) return null;
    
    const severeCases = results.filter(a => a.severity === '死亡').length;
    const moderateCases = results.filter(a => a.severity === '重傷').length;
    
    if (severeCases > 0) {
      return {
        level: '高風險區域',
        class: 'bg-red-50 border-red-300 text-red-700',
        icon: <FiAlertTriangle className="h-5 w-5 text-red-500 mr-2" />,
        message: '此區域有較嚴重事故點，請特別注意行車安全'
      };
    } else if (moderateCases > results.length / 3) {
      return {
        level: '中度風險區域',
        class: 'bg-yellow-50 border-yellow-300 text-yellow-700',
        icon: <FiInfo className="h-5 w-5 text-yellow-500 mr-2" />,
        message: '此區域有數處中度風險事故點，建議小心駕駛'
      };
    } else {
      return {
        level: '一般注意區域',
        class: 'bg-blue-50 border-blue-300 text-blue-700',
        icon: <FiInfo className="h-5 w-5 text-blue-500 mr-2" />,
        message: '此區域事故風險較低，仍請遵守交通規則'
      };
    }
  };

  const riskSummary = getOverallRiskLevel();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <span className="ml-3 text-gray-600 font-medium">資料載入中...</span>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">發生錯誤</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <p className="mt-3">
                <Link
                  href="/accident-search"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <FiArrowLeft className="mr-2 -ml-1" />
                  返回搜尋頁面
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    if (results.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">未找到資料</h3>
              <p className="mt-2 text-yellow-700">
                未找到符合「{keyword}」的搜尋結果
              </p>
              <p className="mt-2 text-yellow-700">
                建議嘗試其他關鍵字，例如：台中、西屯、北區、中港路等
              </p>
              <p className="mt-4">
                <Link
                  href="/accident-search"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  <FiSearch className="mr-2 -ml-1" />
                  重新搜尋
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <>
        {riskSummary && (
          <div className={`mb-6 p-4 border rounded-lg ${riskSummary.class} shadow-sm`}>
            <div className="flex items-start">
              {riskSummary.icon}
              <div>
                <h3 className="font-medium">{riskSummary.level}</h3>
                <p className="text-sm mt-0.5">{riskSummary.message}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              搜尋結果 <span className="font-bold text-blue-600">({results.length})</span>
            </h2>
            <div className="text-sm text-gray-500">
              依事故次數排序
            </div>
          </div>
          <div className="w-20 h-1 bg-blue-600 mt-2 mb-4 rounded-full"></div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm border border-red-200 shadow-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              死亡事故
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm border border-orange-200 shadow-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              重傷事故
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm border border-yellow-200 shadow-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              輕傷事故
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {sortedResults.map((accident) => {
            const riskLevel = calculateRiskLevel(accident);
            
            return (
              <div 
                key={accident.id} 
                className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-white overflow-hidden"
              >
                <div className={`h-2 ${getSeverityClass(accident.severity)}`}></div>
                <div className="p-4 md:p-6">
                  <div className="flex justify-between mb-2">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityClass(accident.severity)}`}
                    >
                      {accident.severity}
                    </span>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskLevel.class}`}
                    >
                      {riskLevel.icon}風險評級：{riskLevel.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{accident.location}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start">
                      <FiAlertTriangle className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-700">事故次數</p>
                        <p className="text-gray-900 text-xl font-bold">{accident.count} 次</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiCalendar className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-700">事故日期</p>
                        <p className="text-gray-900">{accident.date || '未提供'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 mt-6">
                    <div className="flex items-center mb-2">
                      <h4 className="text-base font-semibold text-gray-900">事故描述</h4>
                      <div className="ml-2 flex-grow h-px bg-gray-200"></div>
                    </div>
                    <p className="text-gray-700 mt-1">{accident.description || '無詳細描述'}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h4 className="text-base font-semibold text-gray-900">肇事原因</h4>
                        <div className="ml-2 flex-grow h-px bg-gray-200"></div>
                      </div>
                      <p className="text-gray-700">{accident.cause || '未提供'}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <h4 className="text-base font-semibold text-gray-900">涉及車輛</h4>
                        <div className="ml-2 flex-grow h-px bg-gray-200"></div>
                      </div>
                      <p className="text-gray-700">{accident.vehicles || '未提供'}</p>
                    </div>
                  </div>
                  
                  {accident.weather && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <h4 className="text-base font-semibold text-gray-900">天氣狀況</h4>
                        <div className="ml-2 flex-grow h-px bg-gray-200"></div>
                      </div>
                      <p className="text-gray-700">{accident.weather}</p>
                    </div>
                  )}
                  
                  {accident.latitude && accident.longitude && (
                    <div className="mt-4">
                      <Link 
                        href={`https://www.google.com/maps?q=${accident.latitude},${accident.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
                      >
                        <FiMapPin className="mr-1" /> 
                        在地圖上查看位置 
                        <FiExternalLink className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Link href="/accident-search" className="text-blue-600 hover:text-blue-800 transition inline-flex items-center">
              <FiChevronLeft className="mr-1" />返回搜尋
            </Link>
            <span className="mx-2 text-gray-400">|</span>
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition inline-flex items-center">
              <FiHome className="mr-1" />首頁
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            「{keyword}」的搜尋結果
          </h1>
        </div>
        
        <Link 
          href="/accident-search" 
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-flex items-center shadow-sm"
        >
          <FiSearch className="mr-2" />
          重新搜尋
        </Link>
      </div>
      
      {renderContent()}

      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500">
          * 此資料僅供參考，實際交通狀況可能有所不同。
          請總是遵守交通規則並保持警覺。
        </p>
      </div>
    </div>
  );
}

// 使用一個簡單的 Loading 組件
function SearchResultLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center h-[50vh]">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <span className="ml-4 text-xl text-gray-700 font-medium">載入中...</span>
      </div>
    </div>
  );
}

export default function AccidentSearchResult() {
  return (
    <Suspense fallback={<SearchResultLoading />}>
      <AccidentSearchResultContent />
    </Suspense>
  );
} 