'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getAllMovies, addMovie } from '@/services/firestore';
import { 
  searchTMDBMovies, 
  fetchTrendingMovies,
  fetchPopularMovies, 
  fetchUpcomingMovies, 
  fetchMovieDetails 
} from '@/services/tmdb';
import { Movie } from '@/types';

// 客戶端專用電影資料庫組件
export default function MovieDatabase() {
  // 基本狀態
  const [movies, setMovies] = useState<Movie[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 視圖與類別狀態
  const [source, setSource] = useState<'tmdb' | 'local'>('tmdb');
  const [category, setCategory] = useState<'trending' | 'popular' | 'upcoming'>('trending');
  
  // 詳情視圖狀態
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // 客戶端掛載檢查
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 初始載入熱門電影
  useEffect(() => {
    if (!mounted) return;
    
    const fetchInitialMovies = async () => {
      setInitialLoading(true);
      setError(null);
      
      try {
        // 默認加載趨勢電影
        const trendingMovies = await fetchTrendingMovies();
        setMovies(trendingMovies);
      } catch (err) {
        console.error('TMDB API錯誤:', err);
        setError('無法連接到TMDB電影資料庫。嘗試載入本地電影...');
        
        try {
          // 如果TMDB失敗，從本地獲取
          const localMovies = await getAllMovies();
          setMovies(localMovies);
          setSource('local');
          
          if (localMovies.length === 0) {
            setError('本地資料庫中沒有電影資料。您可以添加電影。');
          } else {
            setError(null);
          }
        } catch (localErr) {
          console.error('讀取本地電影失敗:', localErr);
          setError('無法載入電影資料。請確認資料庫設定是否正確。');
          setMovies([]);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialMovies();
  }, [mounted]);

  // 防止服務端渲染問題 - 將其包裝為一個自定義Hook可以提高代碼的可讀性
  const useSafeClientSideEffect = (callback: () => any, deps: React.DependencyList = []) => {
    useEffect(() => {
      // 確保只在客戶端執行
      if (typeof window !== 'undefined' && mounted) {
        callback();
      }
    }, [mounted, ...deps]);
  };

  // 切換電影來源
  const switchSource = async (newSource: 'tmdb' | 'local') => {
    if (source === newSource) return;
    
    setLoading(true);
    setError(null);
    setKeyword('');
    setSource(newSource);
    
    try {
      if (newSource === 'local') {
        // 載入本地收藏
        const localMovies = await getAllMovies();
        setMovies(localMovies);
        
        if (localMovies.length === 0) {
          setError('本地資料庫中沒有電影資料。您可以從TMDB添加電影到收藏。');
        }
      } else {
        // 切換回TMDB並加載趨勢電影
        setCategory('trending');
        const trendingMovies = await fetchTrendingMovies();
        setMovies(trendingMovies);
      }
    } catch (err) {
      console.error(`切換到${newSource}時發生錯誤:`, err);
      setError(`載入${newSource === 'local' ? '本地' : 'TMDB'}電影資料時發生錯誤。`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // 切換電影類別 (僅TMDB)
  const switchCategory = async (newCategory: 'trending' | 'popular' | 'upcoming') => {
    if (source !== 'tmdb' || category === newCategory) return;
    
    setLoading(true);
    setError(null);
    setKeyword('');
    setCategory(newCategory);
    
    try {
      let categoryMovies: Movie[] = [];
      
      switch (newCategory) {
        case 'trending':
          categoryMovies = await fetchTrendingMovies();
          break;
        case 'popular':
          categoryMovies = await fetchPopularMovies();
          break;
        case 'upcoming':
          categoryMovies = await fetchUpcomingMovies();
          break;
      }
      
      setMovies(categoryMovies);
    } catch (err) {
      console.error(`獲取${newCategory}類型電影時發生錯誤:`, err);
      setError(`載入${newCategory}類型電影時發生錯誤。`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // 搜尋電影
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (source === 'tmdb') {
        const results = await searchTMDBMovies(keyword);
        setMovies(results);
        
        if (results.length === 0) {
          setError(`在TMDB找不到符合「${keyword}」的電影。`);
        }
      } else {
        // 本地搜尋使用Firestore服務
        const localResults = await getAllMovies();
        const filteredResults = localResults.filter(movie => 
          movie.title.toLowerCase().includes(keyword.toLowerCase()) || 
          (movie.director?.toLowerCase().includes(keyword.toLowerCase()) ?? false)
        );
        
        setMovies(filteredResults);
        
        if (filteredResults.length === 0) {
          setError(`在本地收藏中找不到符合「${keyword}」的電影。`);
        }
      }
    } catch (err) {
      console.error('搜尋電影時發生錯誤:', err);
      setError('搜尋電影時發生錯誤，請稍後再試。');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // 監聽搜尋關鍵字變更（自動搜尋）
  useSafeClientSideEffect(() => {
    if (!keyword.trim()) {
      // 如果清空搜尋框，回到對應類別的電影列表
      if (source === 'tmdb') {
        switchCategory(category);
      } else {
        switchSource('local');
      }
      return;
    }
    
    // 使用延遲搜尋，避免每次按鍵都發送請求
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 800);
    
    return () => clearTimeout(debounceTimer);
  }, [keyword, mounted, category]);

  // 查看電影詳情
  const handleViewDetail = async (movie: Movie) => {
    setSelectedMovie(movie);
    setShowDetail(true);
    
    // 如果是TMDB電影且沒有導演信息，則嘗試獲取
    if (source === 'tmdb' && movie.director === '獲取中...' && movie.tmdbId) {
      try {
        const details = await fetchMovieDetails(movie.tmdbId);
        if (details && details.director) {
          setSelectedMovie(prev => prev ? { ...prev, ...details } : prev);
        }
      } catch (err) {
        console.error('獲取電影詳情失敗:', err);
      }
    }
  };

  // 添加到本地收藏
  const handleAddToCollection = async (movie: Movie) => {
    if (!movie) return;
    
    try {
      setLoading(true);
      
      // 轉換為本地Movie格式
      await addMovie({
        id: `local-${Date.now()}`, // 生成唯一ID
        title: movie.title,
        releaseDate: movie.releaseDate,
        director: movie.director,
        description: movie.description,
        posterUrl: movie.posterUrl,
        detailUrl: movie.detailUrl
      });
      
      alert(`已將「${movie.title}」添加到本地收藏！`);
      
      if (source === 'local') {
        // 如果當前在本地視圖，刷新列表
        const localMovies = await getAllMovies();
        setMovies(localMovies);
      }
    } catch (err) {
      console.error('添加電影到本地收藏時發生錯誤:', err);
      alert('添加電影到本地收藏時發生錯誤。');
    } finally {
      setLoading(false);
    }
  };

  // 防止水合錯誤 - 只在客戶端渲染
  if (typeof window === 'undefined') {
    return null; // 服務端不渲染任何內容
  }

  // 如果尚未掛載到客戶端，返回載入動畫
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* 頁面頂部 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg" suppressHydrationWarning>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2" suppressHydrationWarning>電影資料庫</h1>
          <p className="text-sm opacity-80" suppressHydrationWarning>使用TMDB開放電影資料庫 | 支援中文搜尋</p>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
        {/* 搜尋框 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" suppressHydrationWarning>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={`搜尋${source === 'tmdb' ? 'TMDB' : '本地'}電影...`}
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  suppressHydrationWarning
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex-none">
              <button 
                onClick={() => handleSearch()}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading || !keyword.trim()}
                suppressHydrationWarning
              >
                搜尋
              </button>
            </div>
          </div>
        </div>

        {/* 切換資料來源 */}
        <div className="mb-6 flex flex-wrap items-center gap-2" suppressHydrationWarning>
          <button
            onClick={() => switchSource('tmdb')}
            className={`px-5 py-2 rounded-full text-sm font-medium ${
              source === 'tmdb' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            suppressHydrationWarning
          >
            TMDB資料庫
          </button>
          <button
            onClick={() => switchSource('local')}
            className={`px-5 py-2 rounded-full text-sm font-medium ${
              source === 'local' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            suppressHydrationWarning
          >
            本地收藏
          </button>
        </div>

        {/* 電影類別標籤 (僅TMDB模式顯示) */}
        {source === 'tmdb' && (
          <div className="mb-8 flex flex-wrap items-center gap-2" suppressHydrationWarning>
            <button
              onClick={() => switchCategory('trending')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === 'trending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              suppressHydrationWarning
            >
              熱門趨勢
            </button>
            <button
              onClick={() => switchCategory('popular')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === 'popular' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              suppressHydrationWarning
            >
              最受歡迎
            </button>
            <button
              onClick={() => switchCategory('upcoming')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              suppressHydrationWarning
            >
              即將上映
            </button>
          </div>
        )}

        {/* 載入中提示 */}
        {(initialLoading || loading) && (
          <div className="flex justify-center my-12" suppressHydrationWarning>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* 錯誤提示 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6" suppressHydrationWarning>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700" suppressHydrationWarning>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 電影列表 */}
        {!initialLoading && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" suppressHydrationWarning>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div 
                  key={movie.id || movie.title}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                  suppressHydrationWarning
                >
                  {/* 電影卡片 */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleViewDetail(movie)}
                    suppressHydrationWarning
                  >
                    <div className="relative h-64 bg-gray-200" suppressHydrationWarning>
                      {movie.posterUrl ? (
                        <Image 
                          src={movie.posterUrl} 
                          alt={movie.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4" suppressHydrationWarning>
                      <h3 className="text-md font-semibold text-gray-800 mb-1 line-clamp-1" suppressHydrationWarning>{movie.title}</h3>
                      <p className="text-sm text-gray-500 mb-1" suppressHydrationWarning>{movie.releaseDate}</p>
                      <p className="text-sm text-gray-600 line-clamp-1" suppressHydrationWarning>{movie.director}</p>
                    </div>
                  </div>
                  
                  {/* 收藏按鈕 (僅在TMDB模式顯示) */}
                  {source === 'tmdb' && (
                    <div className="p-3 pt-0 border-t border-gray-100" suppressHydrationWarning>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCollection(movie);
                        }}
                        className="w-full py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded hover:bg-indigo-100 transition"
                        suppressHydrationWarning
                      >
                        收藏此電影
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12" suppressHydrationWarning>
                <div className="text-gray-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4" suppressHydrationWarning>沒有找到相符的電影</p>
                
                {source === 'local' && (
                  <button
                    onClick={() => switchSource('tmdb')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    suppressHydrationWarning
                  >
                    瀏覽TMDB電影
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 返回首頁按鈕 */}
      <div className="container mx-auto px-4 py-6" suppressHydrationWarning>
        <Link href="/" className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
          返回首頁
        </Link>
      </div>

      {/* 電影詳情彈窗 */}
      {showDetail && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" suppressHydrationWarning>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" suppressHydrationWarning>
            <div className="flex flex-col md:flex-row" suppressHydrationWarning>
              {/* 海報 */}
              <div className="md:w-1/3 bg-gray-100" suppressHydrationWarning>
                <div className="relative h-72 md:h-full" suppressHydrationWarning>
                  {selectedMovie.posterUrl ? (
                    <Image 
                      src={selectedMovie.posterUrl} 
                      alt={selectedMovie.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 詳細資訊 */}
              <div className="md:w-2/3 p-6 overflow-y-auto max-h-[90vh] md:max-h-[70vh]" suppressHydrationWarning>
                <div className="flex justify-between items-start" suppressHydrationWarning>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2" suppressHydrationWarning>{selectedMovie.title}</h2>
                  <button 
                    onClick={() => setShowDetail(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    suppressHydrationWarning
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4" suppressHydrationWarning>
                  <p className="text-gray-600 mb-2" suppressHydrationWarning>上映日期：{selectedMovie.releaseDate}</p>
                  <p className="text-gray-600 mb-2" suppressHydrationWarning>導演：{selectedMovie.director}</p>
                </div>
                
                <div className="mb-6" suppressHydrationWarning>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700" suppressHydrationWarning>劇情簡介</h3>
                  <p className="text-gray-600 whitespace-pre-line" suppressHydrationWarning>
                    {selectedMovie.description || '暫無描述'}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3" suppressHydrationWarning>
                  {selectedMovie.detailUrl && (
                    <a 
                      href={selectedMovie.detailUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      suppressHydrationWarning
                    >
                      查看TMDB頁面
                    </a>
                  )}
                  
                  {source === 'tmdb' && (
                    <button
                      onClick={() => handleAddToCollection(selectedMovie)}
                      className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      suppressHydrationWarning
                    >
                      添加到本地收藏
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 