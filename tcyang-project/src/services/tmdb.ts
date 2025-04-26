// TMDB API 服務
// 文檔: https://developer.themoviedb.org/docs

import { Movie } from '@/types';

// TMDB API 配置
const TMDB_API_KEY = 'e370d7ffa4e8607a5613f6c1e84a9be9'; // 請替換為您的API密鑰
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const LANGUAGE = 'zh-TW'; // 繁體中文

// 從TMDB獲取熱門電影
export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  try {
    console.log('正在獲取TMDB熱門電影...');
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=${LANGUAGE}&region=TW`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API 錯誤: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`獲取到 ${data.results?.length || 0} 部熱門電影`);
    
    // 將TMDB電影數據轉換為我們的Movie類型
    return data.results.map((movie: any) => ({
      id: `tmdb-${movie.id}`,
      title: movie.title,
      releaseDate: movie.release_date || '未知日期',
      director: '獲取中...', // TMDB不直接提供導演信息，需要額外請求
      description: movie.overview || '暫無描述',
      posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : undefined,
      detailUrl: `https://www.themoviedb.org/movie/${movie.id}?language=${LANGUAGE}`,
      tmdbId: movie.id, // 保存TMDB ID以便後續處理
    }));
  } catch (error) {
    console.error('獲取TMDB熱門電影失敗:', error);
    throw error;
  }
};

// 從TMDB搜索電影
export const searchTMDBMovies = async (keyword: string): Promise<Movie[]> => {
  try {
    console.log(`正在TMDB搜索電影: "${keyword}"...`);
    
    // 確保關鍵字被正確編碼
    const encodedKeyword = encodeURIComponent(keyword.trim());
    
    // 構建API請求URL
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=${LANGUAGE}&query=${encodedKeyword}&include_adult=false&region=TW`;
    console.log(`TMDB 搜索 URL: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDB API 錯誤: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`搜索 "${keyword}" 找到 ${data.results?.length || 0} 部電影`);
    
    if (data.results?.length === 0) {
      // 如果沒有搜索到結果，嘗試使用多語言搜索
      console.log('嘗試使用多語言搜索...');
      const multiLanguageResponse = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodedKeyword}&include_adult=false`
      );
      
      if (!multiLanguageResponse.ok) {
        throw new Error(`TMDB 多語言API 錯誤: ${multiLanguageResponse.status}`);
      }
      
      const multiLanguageData = await multiLanguageResponse.json();
      console.log(`多語言搜索找到 ${multiLanguageData.results?.length || 0} 部電影`);
      
      if (multiLanguageData.results?.length > 0) {
        // 使用多語言搜索結果，但請求繁體中文的詳細信息
        const moviesWithDetails = await Promise.all(
          multiLanguageData.results.slice(0, 10).map(async (movie: any) => {
            try {
              const detailResponse = await fetch(
                `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=${LANGUAGE}`
              );
              
              if (detailResponse.ok) {
                const detailData = await detailResponse.json();
                return {
                  id: `tmdb-${movie.id}`,
                  title: detailData.title || movie.title,
                  releaseDate: detailData.release_date || movie.release_date || '未知日期',
                  director: '獲取中...',
                  description: detailData.overview || movie.overview || '暫無描述',
                  posterUrl: detailData.poster_path ? 
                      `${TMDB_IMAGE_BASE_URL}${detailData.poster_path}` : 
                      (movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : undefined),
                  detailUrl: `https://www.themoviedb.org/movie/${movie.id}?language=${LANGUAGE}`,
                  tmdbId: movie.id,
                };
              }
              return null;
            } catch (error) {
              console.error(`獲取電影 ${movie.id} 詳情失敗:`, error);
              return null;
            }
          })
        );
        
        return moviesWithDetails.filter(Boolean) as Movie[];
      }
    }
    
    // 將TMDB電影數據轉換為我們的Movie類型
    return data.results.map((movie: any) => ({
      id: `tmdb-${movie.id}`,
      title: movie.title,
      releaseDate: movie.release_date || '未知日期',
      director: '獲取中...', // TMDB不直接提供導演信息
      description: movie.overview || '暫無描述',
      posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : undefined,
      detailUrl: `https://www.themoviedb.org/movie/${movie.id}?language=${LANGUAGE}`,
      tmdbId: movie.id,
    }));
  } catch (error) {
    console.error('TMDB搜索電影失敗:', error);
    throw error;
  }
};

// 獲取即將上映的電影
export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    console.log('正在獲取TMDB即將上映電影...');
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=${LANGUAGE}&region=TW`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API 錯誤: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`獲取到 ${data.results?.length || 0} 部即將上映電影`);
    
    return data.results.map((movie: any) => ({
      id: `tmdb-${movie.id}`,
      title: movie.title,
      releaseDate: movie.release_date || '未知日期',
      director: '獲取中...',
      description: movie.overview || '暫無描述',
      posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : undefined,
      detailUrl: `https://www.themoviedb.org/movie/${movie.id}?language=${LANGUAGE}`,
      tmdbId: movie.id,
    }));
  } catch (error) {
    console.error('獲取TMDB即將上映電影失敗:', error);
    throw error;
  }
};

// 獲取熱門電影
export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    console.log('正在獲取TMDB熱門電影...');
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=${LANGUAGE}&region=TW`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API 錯誤: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`獲取到 ${data.results?.length || 0} 部熱門電影`);
    
    return data.results.map((movie: any) => ({
      id: `tmdb-${movie.id}`,
      title: movie.title,
      releaseDate: movie.release_date || '未知日期',
      director: '獲取中...',
      description: movie.overview || '暫無描述',
      posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : undefined,
      detailUrl: `https://www.themoviedb.org/movie/${movie.id}?language=${LANGUAGE}`,
      tmdbId: movie.id,
    }));
  } catch (error) {
    console.error('獲取TMDB熱門電影失敗:', error);
    throw error;
  }
};

// 獲取電影詳情（包括導演信息）
export const fetchMovieDetails = async (tmdbId: number): Promise<Partial<Movie>> => {
  try {
    // 獲取電影詳情
    const movieResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=${LANGUAGE}&append_to_response=credits`
    );
    
    if (!movieResponse.ok) {
      throw new Error(`TMDB API 錯誤: ${movieResponse.status}`);
    }
    
    const movieData = await movieResponse.json();
    
    // 從製作人員中找出導演
    const director = movieData.credits?.crew?.find((person: any) => person.job === 'Director')?.name || '未知導演';
    
    return {
      director,
      // 可以在這裡添加更多詳細信息
    };
  } catch (error) {
    console.error(`獲取TMDB電影${tmdbId}詳情失敗:`, error);
    return { director: '未知導演' };
  }
}; 