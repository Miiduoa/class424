'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { searchAccidentData } from '@/services/opendata';
import { Accident } from '@/types';
import ClientOnly from '@/components/ClientOnly';

export default function AccidentSearchSamePage() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Accident[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      setError('請輸入搜尋關鍵字');
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      // 使用開放資料服務搜尋事故資料
      const data = await searchAccidentData(keyword);
      setResults(data);
      setSearched(true);
    } catch (err) {
      console.error('Error searching accident data:', err);
      setError('搜尋資料時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // 色彩心理學：根據嚴重程度返回適當的顏色類別
  const getSeverityColorClass = (severity: string) => {
    switch (severity) {
      case '死亡':
        return 'bg-red-100 text-red-800 border-red-200 shadow-red-100';
      case '重傷':
        return 'bg-amber-100 text-amber-800 border-amber-200 shadow-amber-100';
      case '輕傷':
        return 'bg-green-100 text-green-800 border-green-200 shadow-green-100';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 shadow-blue-100';
    }
  };

  // 認知負荷管理：獲取總體風險水平和對應視覺反饋
  const getOverallRiskLevel = () => {
    if (results.length === 0) return null;
    
    const severeCases = results.filter(a => a.severity === '死亡').length;
    const moderateCases = results.filter(a => a.severity === '重傷').length;
    
    if (severeCases > 0) {
      return {
        level: '高風險區域',
        class: 'bg-red-50 border-red-200 text-red-700',
        icon: '⚠️',
        message: '此區域有較嚴重事故點，請特別注意行車安全'
      };
    } else if (moderateCases > results.length / 3) {
      return {
        level: '中度風險區域',
        class: 'bg-amber-50 border-amber-200 text-amber-700',
        icon: '⚠️',
        message: '此區域有數處中度風險事故點，建議小心駕駛'
      };
    } else {
      return {
        level: '一般注意區域',
        class: 'bg-blue-50 border-blue-200 text-blue-700',
        icon: 'ℹ️',
        message: '此區域事故風險較低，仍請遵守交通規則'
      };
    }
  };
  
  // 根據事故數量排序結果
  const sortedResults = [...results].sort((a, b) => b.count - a.count);
  
  // 獲取風險總結
  const riskSummary = getOverallRiskLevel();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* 頁面標題 - 使用對比色增強視覺衝擊力 */}
      <div className="text-center mb-10">
        <div className="inline-block p-1.5 px-4 rounded-full bg-blue-600 text-white text-sm font-medium mb-3">
          交通安全資訊系統
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">交通事故熱點分析</h1>
        <div className="w-32 h-2 bg-blue-600 mx-auto mb-4 rounded-full"></div>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          搜尋並分析台中市114年1月易肇事路口資料，提供風險評估與安全建議
        </p>
      </div>
      
      {/* 資料來源與使用說明 - 建立信任和透明度 */}
      <div className="mb-8 p-5 rounded-lg border-2 border-blue-300 bg-blue-50 shadow-md transition-all hover:shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 pt-1">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-blue-900">關於本資料</h3>
            <div className="mt-1 text-blue-700">
              <p className="mb-2">
                資料來源：
                <a 
                  href="https://data.gov.tw/dataset/173126" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-blue-900 transition-colors"
                >
                  政府開放資料平台 - 台中市114年01月份十大易肇事路段(口)
                </a>
              </p>
              <p>本資料旨在協助用路人了解潛在風險區域，提高行車安全意識。結果僅供參考，請以實際路況為準。</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 搜尋區塊 - 視覺凸顯重要元素 */}
      <div className="mb-10 bg-white rounded-xl shadow-lg border-0 overflow-hidden transform transition-all">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            路口風險查詢
          </h2>
        </div>
        
        <form onSubmit={handleSearch} className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                請輸入路口關鍵字
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="例如：中港、漢口、台灣大道"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                可輸入道路名稱、路口名稱或區域，例如：中清路、大墩路口、西屯區
              </p>
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full md:w-auto py-3 px-6 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    查詢中...
                  </>
                ) : (
                  <>
                    <svg className="mr-1 h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    查詢風險
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* 搜尋前的初始狀態 - 降低用戶焦慮 */}
      {!searched && !loading && (
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden p-8 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">輸入關鍵字開始查詢</h3>
          <p className="text-gray-600 max-w-lg mx-auto">
            在上方輸入路口名稱、道路名或區域名稱，查詢該區域的交通事故風險分析數據。
          </p>
        </div>
      )}
      
      {/* 搜尋結果區域 */}
      {searched && (
        <div className="space-y-6">
          {/* 搜尋結果概述 - 提供整體情境認知 */}
          <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-100 to-blue-100 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">搜尋結果概述</h2>
            </div>
            
            <div className="p-6">
              {results.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">未發現相關事故資料</h3>
                  <p className="text-gray-600">
                    在「{keyword}」相關路口未找到近期交通事故記錄，但仍應保持安全駕駛。
                  </p>
                  <button
                    onClick={() => {setKeyword(''); setSearched(false);}}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    重新搜尋
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
                    <div>
                      <p className="mb-1 text-gray-600">
                        關鍵字「<span className="font-medium text-gray-900">{keyword}</span>」的搜尋結果：
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        找到 {results.length} 處相關風險路口
                      </h3>
                    </div>
                    
                    {riskSummary && (
                      <div className={`mt-4 md:mt-0 p-3 rounded-md ${riskSummary.class} inline-flex items-start`}>
                        <span className="text-xl mr-2">{riskSummary.icon}</span>
                        <div>
                          <p className="font-semibold">{riskSummary.level}</p>
                          <p className="text-sm">{riskSummary.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 風險等級說明 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-red-50 p-3 rounded-md border border-red-200">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-1">⚠️</span>
                        <span className="font-medium text-red-700">高風險區域</span>
                      </div>
                      <p className="text-sm text-red-600">有死亡事故紀錄，需特別注意安全</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-1">⚠️</span>
                        <span className="font-medium text-amber-700">中度風險區域</span>
                      </div>
                      <p className="text-sm text-amber-600">有重傷事故紀錄，建議減速慢行</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-1">ℹ️</span>
                        <span className="font-medium text-blue-700">一般注意區域</span>
                      </div>
                      <p className="text-sm text-blue-600">輕傷事故紀錄，遵守交通規則</p>
                    </div>
                  </div>
                  
                  <div className="border-2 border-amber-300 bg-amber-50 rounded-md p-4 mb-6 shadow-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">安全提示</h3>
                        <div className="mt-1 text-sm text-amber-700">
                          <p>經過以上路口時，請減速慢行，保持安全距離，特別注意號誌變化與周圍車輛動向。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* 事故詳細資料表格 - 格式塔原理：相關資訊分組呈現 */}
          {results.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-100 to-blue-100 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">詳細風險點資料</h2>
              </div>
              
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          風險等級
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          路口位置
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          事故次數
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          詳細說明
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedResults.map((accident, index) => (
                        <tr key={accident.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColorClass(accident.severity)}`}>
                              {accident.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{accident.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-semibold">{accident.count} 次</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {accident.description || `${accident.location}有${accident.count}起${accident.severity}事故紀錄`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">資料更新時間: 2025年01月15日</p>
                </div>
              </div>
            </div>
          )}
          
          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">常見肇事原因分析</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">未注意車前狀況：交通繁忙路段最常見肇因</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">違反號誌或標誌：忽略紅燈或停讓標誌</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">未保持安全距離或間隔：導致追撞事件</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">轉彎車未讓直行車：常見於十字路口碰撞</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">變換車道或方向不當：未先觀察周圍交通</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">安全駕駛建議</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">路口減速慢行，即使是綠燈也要觀察左右來車</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">保持安全車距，不急煞也不緊貼前車</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">轉彎前提前使用方向燈，確認安全後再轉彎</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">注意天候變化，雨天路面濕滑時提前減速</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">避免疲勞駕駛，開車時遠離手機等分心行為</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* 相關資源與引導 */}
          {results.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">延伸資源</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <a href="https://thub.police.gov.tw/" target="_blank" rel="noopener noreferrer" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="text-base font-medium text-gray-900 mb-1">交通事故分析平台</h4>
                    <p className="text-sm text-gray-600">全國交通事故資料分析網，提供更多詳細資訊與歷史數據。</p>
                  </a>
                  <a href="https://www.npa.gov.tw/ch/app/artwebsite/view?module=artwebsite&id=2289&serno=cf3d5712-5f14-43a9-891b-1d5c2f77c7ba" target="_blank" rel="noopener noreferrer" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="text-base font-medium text-gray-900 mb-1">路口安全守則</h4>
                    <p className="text-sm text-gray-600">警政署提供的路口安全指南，協助用路人提高警覺。</p>
                  </a>
                </div>
                
                <div className="mt-6 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">您知道嗎？</h3>
                  <p className="text-gray-700">大多數交通事故發生在駕駛者熟悉的路段，因為熟悉環境可能導致注意力下降。即使是常走的路線，也請保持警覺。</p>
                  <div className="mt-3 text-sm text-gray-500 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    資料來源：交通部道路交通安全研究報告
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 新增：用戶互動區塊 */}
          {results.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">您的回饋</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">這些資訊對您有幫助嗎？您的意見能幫助我們改進服務。</p>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                    有幫助 👍
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    可以改進 💡
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 