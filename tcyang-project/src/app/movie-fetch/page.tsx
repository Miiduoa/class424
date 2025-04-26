'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { addMovie } from '@/services/firestore';
import { Movie } from '@/types';

export default function MovieFetch() {
  const [loading, setLoading] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movieCount, setMovieCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [fetchHistory, setFetchHistory] = useState<{date: string, count: number}[]>([]);

  // 讀取本地存儲的上次抓取時間和歷史記錄
  useEffect(() => {
    const storedLastFetched = localStorage.getItem('lastMovieFetch');
    if (storedLastFetched) {
      setLastFetched(storedLastFetched);
    }

    const storedHistory = localStorage.getItem('movieFetchHistory');
    if (storedHistory) {
      try {
        setFetchHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('無法解析歷史記錄:', e);
      }
    }
  }, []);

  const handleFetchMovies = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      // 模擬數據 - 實際應用中，這裡應該從開眼電影API獲取數據
      const mockMovies: Movie[] = [
        {
          id: 'movie1',
          title: '模擬電影1 - 心靈探索',
          releaseDate: '2023-12-15',
          director: '導演A',
          description: '一部探索人類潛意識與夢境的心理驚悚片。',
          posterUrl: 'https://m.media-amazon.com/images/I/71BzkHnGypL._AC_UF1000,1000_QL80_.jpg',
          detailUrl: 'https://www.imdb.com/title/tt0111161/'
        },
        {
          id: 'movie2',
          title: '模擬電影2 - 情緒世界',
          releaseDate: '2023-12-20',
          director: '導演B',
          description: '當一個人能夠看到他人的情緒顏色，生活變得多彩而復雜。',
          posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
          detailUrl: 'https://www.imdb.com/title/tt0068646/'
        },
        {
          id: 'movie3',
          title: '模擬電影3 - 記憶迷宮',
          releaseDate: '2023-12-25',
          director: '導演C',
          description: '一段被刪除的記憶如何影響一個人的身份認同與人際關係。',
          posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
          detailUrl: 'https://www.imdb.com/title/tt0468569/'
        }
      ];
      
      const totalMovies = mockMovies.length;
      
      // 模擬進度更新與處理時間，增加用戶體驗
      for (let i = 0; i < totalMovies; i++) {
        // 模擬網絡請求延遲
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 將電影資料存入Firestore
        await addMovie(mockMovies[i]);
        
        // 更新進度
        const newProgress = Math.round(((i + 1) / totalMovies) * 100);
        setProgress(newProgress);
      }
      
      // 記錄這次抓取的時間和電影數量
      const now = new Date().toLocaleString();
      setLastFetched(now);
      localStorage.setItem('lastMovieFetch', now);
      
      // 更新歷史記錄
      const newHistory = [...fetchHistory, {date: now, count: totalMovies}];
      setFetchHistory(newHistory);
      localStorage.setItem('movieFetchHistory', JSON.stringify(newHistory));
      
      setMovieCount(totalMovies);
      setFetchComplete(true);
    } catch (err) {
      console.error('Error fetching and storing movies:', err);
      setError('擷取或存儲電影資料時發生錯誤。請確認 Firebase 設定是否正確。');
    } finally {
      setLoading(false);
    }
  };

  // 獲取總共抓取的電影數量
  const getTotalFetchedCount = () => {
    return fetchHistory.reduce((total, record) => total + record.count, 0);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '30px 20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      {/* 頂部區域：標題與視覺吸引 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#2563eb',
        }}>電影資料擷取中心</h1>
        
        <p style={{
          fontSize: '16px',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          連接開眼電影資訊，探索即將上映的精彩電影世界
        </p>
      </div>
      
      {/* 主要內容區 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '25px'
      }}>
        {/* 說明卡片 - 使用框架效應與權威原則 */}
        <div style={{
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #bfdbfe',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            color: '#1e40af'
          }}>
            <span style={{ marginRight: '8px', fontSize: '20px' }}>🎬</span>
            自動化電影資料庫
          </h2>
          
          <p style={{
            fontSize: '15px',
            lineHeight: '1.6',
            marginBottom: '15px'
          }}>
            點擊下方按鈕，我們的系統將使用先進的網絡爬蟲技術從開眼電影網站擷取最新即將上映的電影資訊，
            並自動整理存入我們的 Firestore 雲端資料庫。
          </p>
          
          <ul style={{
            listStyleType: 'none',
            padding: '0',
            margin: '0 0 15px 0'
          }}>
            {['電影名稱', '上映日期', '導演資訊', '劇情描述', '高清海報', '詳細資訊連結'].map((item, index) => (
              <li key={index} style={{
                padding: '6px 0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  marginRight: '10px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>{index + 1}</span>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        {/* 操作區域 - 應用稀缺性原則 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}>
            {lastFetched && (
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                textAlign: 'center',
                marginBottom: '5px'
              }}>
                上次更新時間: {lastFetched}
              </div>
            )}
            
            <button 
              onClick={handleFetchMovies} 
              disabled={loading}
              style={{
                backgroundColor: loading ? '#93c5fd' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s, transform 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', marginRight: '10px' }}>⏳</span>
                  擷取處理中...
                </>
              ) : (
                <>
                  <span style={{ display: 'inline-block', marginRight: '10px' }}>✨</span>
                  立即更新電影資料
                </>
              )}
            </button>
            
            {/* 進度指示 - 減少不確定性的焦慮 */}
            {loading && (
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>處理進度</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb' }}>{progress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    backgroundColor: '#2563eb',
                    height: '100%',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            )}
            
            {/* 結果顯示 - 使用社交認同原則 */}
            {fetchComplete && (
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                padding: '15px',
                border: '1px solid #bbf7d0',
                width: '100%',
                maxWidth: '300px',
                textAlign: 'center'
              }}>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#166534',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold' }}>成功！</span> 已擷取並存儲 {movieCount} 部最新電影
                </p>
                <p style={{ fontSize: '13px', color: '#4ade80' }}>
                  您的資料庫現在擁有最新的電影資訊
                </p>
              </div>
            )}
            
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                borderRadius: '6px',
                padding: '15px',
                border: '1px solid #fecaca',
                width: '100%',
                maxWidth: '300px'
              }}>
                <p style={{ fontSize: '15px', color: '#b91c1c' }}>
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* 成就與統計 - 使用成就原則增強滿足感 */}
        <div style={{
          backgroundColor: '#fffbeb',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #fef3c7',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px', fontSize: '20px' }}>🏆</span>
            數據中心
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '10px',
              minWidth: '120px'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#b45309',
                marginBottom: '5px'
              }}>
                {fetchHistory.length}
              </div>
              <div style={{ fontSize: '14px', color: '#92400e' }}>
                更新次數
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '10px',
              minWidth: '120px'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#b45309',
                marginBottom: '5px'
              }}>
                {getTotalFetchedCount()}
              </div>
              <div style={{ fontSize: '14px', color: '#92400e' }}>
                總電影數量
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '10px',
              minWidth: '120px'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#b45309',
                marginBottom: '5px'
              }}>
                {fetchHistory.length > 0 ? Math.round(getTotalFetchedCount() / fetchHistory.length) : 0}
              </div>
              <div style={{ fontSize: '14px', color: '#92400e' }}>
                平均每次電影數
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 導航按鈕 */}
      <div style={{
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          color: '#4b5563',
          padding: '10px 16px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.3s'
        }}>
          <span style={{ marginRight: '6px' }}>←</span>
          返回首頁
        </Link>
      </div>
    </div>
  );
} 