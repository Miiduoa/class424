// OMDb API 服務
// 文檔: https://www.omdbapi.com/

import { Movie } from '@/types';
import { safeApiRequest } from '@/utils/gmPolyfill';

// API 響應類型定義
interface OmdbResponse {
  Response: string;
  Error?: string;
  Search?: any[];
  [key: string]: any;
}

// OMDb API 配置
const OMDB_API_KEYS = [
  '8ec59a3e',
  '2edf5c13',
  '8a0badff',
  '12afb4fc',
  'f9d3fe8e'
]; // 多個API密鑰輪換使用
const OMDB_BASE_URL = 'https://www.omdbapi.com';

// 請求配置
const FETCH_TIMEOUT = 10000; // 10秒超時
const RETRY_COUNT = OMDB_API_KEYS.length; // 重試次數等於API密鑰數量

let currentKeyIndex = 0;

// 獲取下一個API密鑰
const getNextApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % OMDB_API_KEYS.length;
  return OMDB_API_KEYS[currentKeyIndex];
};

// 帶超時的fetch函數
const fetchWithTimeout = async (url: string, options = {}, timeout = FETCH_TIMEOUT) => {
  // 確保只在客戶端執行
  if (typeof window === 'undefined') {
    throw new Error('fetchWithTimeout is only available in browser environment');
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// 轉換OMDb API響應為我們的Movie類型
const convertOmdbToMovie = (omdbMovie: any): Movie => {
  // Default fallback poster
  let posterUrl = '/images/movie-placeholder.svg';
  
  // Handle poster URL with better error checking
  if (omdbMovie.Poster && omdbMovie.Poster !== 'N/A') {
    // Do minimal processing to avoid issues
    posterUrl = omdbMovie.Poster;
    
    // Just ensure HTTPS
    if (posterUrl.startsWith('http:')) {
      posterUrl = posterUrl.replace(/^http:/i, 'https:');
    }
    
    console.log(`OMDB service: Using poster URL: ${posterUrl} for ${omdbMovie.Title}`);
  } else {
    console.log(`OMDB service: No valid poster URL for ${omdbMovie.Title || 'unknown movie'}, using fallback`);
    
    // Try to get a poster from IMDB directly if we have an IMDB ID
    if (omdbMovie.imdbID) {
      // This is a common pattern for IMDB posters
      posterUrl = `https://m.media-amazon.com/images/M/${omdbMovie.imdbID}.jpg`;
      console.log(`OMDB service: Trying alternative IMDB poster URL: ${posterUrl}`);
    }
  }
  
  return {
    id: `omdb-${omdbMovie.imdbID}`,
    title: omdbMovie.Title || '未知標題',
    releaseDate: omdbMovie.Year || '未知日期',
    director: omdbMovie.Director || '未知導演',
    description: omdbMovie.Plot || '暫無描述',
    posterUrl,
    detailUrl: `https://www.imdb.com/title/${omdbMovie.imdbID}`,
    imdbID: omdbMovie.imdbID,
    rating: omdbMovie.imdbRating || '暫無評分',
    genre: omdbMovie.Genre || '未知類型',
    language: omdbMovie.Language || '未知語言',
    country: omdbMovie.Country || '未知國家',
    runtime: omdbMovie.Runtime || '未知片長',
    actors: omdbMovie.Actors || '未知演員',
    awards: omdbMovie.Awards || '暫無獲獎記錄',
    boxOffice: omdbMovie.BoxOffice || '未知票房',
    metascore: omdbMovie.Metascore || '暫無評分'
  };
};

// 使用安全API請求函數獲取OMDb數據
async function fetchOMDbAPI(endpoint: string, retryCount = 0): Promise<OmdbResponse> {
  // 防止服務器端請求失敗
  if (typeof window === 'undefined') {
    return {
      Response: 'False',
      Error: 'API requests are only supported in browser environment'
    };
  }

  if (retryCount >= RETRY_COUNT) {
    throw new Error('所有API密鑰都已嘗試但均失敗');
  }

  try {
    const currentKey = OMDB_API_KEYS[currentKeyIndex];
    const fullUrl = `${endpoint}&apikey=${currentKey}`;
    
    let data: OmdbResponse;
    try {
      data = await safeApiRequest<OmdbResponse>(fullUrl);
    } catch (fetchError) {
      console.error('API請求錯誤，嘗試下一個密鑰:', fetchError);
      currentKeyIndex = (currentKeyIndex + 1) % OMDB_API_KEYS.length;
      return fetchOMDbAPI(endpoint, retryCount + 1);
    }
    
    if (data.Response === 'False') {
      if (data.Error && (
        data.Error.includes('Invalid API key') ||
        data.Error.includes('Request limit reached')
      )) {
        console.log(`API密鑰 ${currentKey} 無效或達到限制，嘗試下一個...`);
        currentKeyIndex = (currentKeyIndex + 1) % OMDB_API_KEYS.length;
        return fetchOMDbAPI(endpoint, retryCount + 1);
      }
      
      return {
        Response: 'False',
        Error: data.Error || '未知錯誤'
      };
    }
    
    return data;
  } catch (error) {
    console.error('OMDb API請求失敗:', error);
    
    // 網絡錯誤時嘗試下一個密鑰
    currentKeyIndex = (currentKeyIndex + 1) % OMDB_API_KEYS.length;
    return fetchOMDbAPI(endpoint, retryCount + 1);
  }
}

// 搜索電影
export const searchMovies = async (keyword: string): Promise<Movie[]> => {
  // 防止服務器端請求
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    console.log(`使用OMDb搜索電影: "${keyword}"...`);
    
    // 確保關鍵字被正確編碼
    const encodedKeyword = encodeURIComponent(keyword.trim());
    
    // 構建API請求URL - 搜索多部電影
    const url = `${OMDB_BASE_URL}/?s=${encodedKeyword}&type=movie`;
    
    const data = await fetchOMDbAPI(url);
    
    if (data.Response === 'False' || !data.Search) {
      console.log(`OMDb搜索 "${keyword}" 無結果: ${data.Error}`);
      return [];
    }
    
    console.log(`OMDb搜索 "${keyword}" 找到 ${data.Search.length} 部電影`);
    
    // 獲取電影詳情
    const detailedMovies = await Promise.all(
      data.Search.slice(0, 10).map(async (movie: any) => {
        try {
          return await getMovieDetails(movie.imdbID);
        } catch (error) {
          console.error(`獲取電影 ${movie.imdbID} 詳情失敗:`, error);
          // 即使詳情獲取失敗也使用基本數據
          return convertOmdbToMovie(movie);
        }
      })
    );
    
    return detailedMovies;
  } catch (error) {
    console.error('OMDb搜索電影失敗:', error);
    return [];
  }
};

// 獲取電影詳情
export const getMovieDetails = async (imdbID: string): Promise<Movie> => {
  // 防止服務器端請求
  if (typeof window === 'undefined') {
    throw new Error('API requests are only supported in browser environment');
  }

  try {
    const url = `${OMDB_BASE_URL}/?i=${imdbID}&plot=full`;
    
    const data = await fetchOMDbAPI(url);
    
    if (data.Response === 'False') {
      throw new Error(`OMDb 獲取電影詳情失敗: ${data.Error}`);
    }
    
    return convertOmdbToMovie(data);
  } catch (error) {
    console.error(`獲取電影詳情失敗:`, error);
    throw error;
  }
};

// 本地備用數據 - 熱門電影
const localTopMovies: Movie[] = [
  {
    id: 'local-1',
    title: '肖申克的救贖',
    releaseDate: '1994',
    director: '法蘭克·達拉邦特',
    description: '兩個被囚禁在肖申克監獄的男人，在多年中找到共同點，並尋求安慰和最終的救贖。',
    posterUrl: 'https://i.imgur.com/gjRGiJh.png',
    detailUrl: 'https://www.imdb.com/title/tt0111161',
    imdbID: 'tt0111161',
    rating: '9.3',
    genre: '劇情'
  },
  {
    id: 'local-2',
    title: '教父',
    releaseDate: '1972',
    director: '弗朗西斯·福特·科波拉',
    description: '一個黑幫家族的首領將控制權交給了他不情願的兒子。',
    posterUrl: 'https://i.imgur.com/gjRGiJh.png',
    detailUrl: 'https://www.imdb.com/title/tt0068646',
    imdbID: 'tt0068646',
    rating: '9.2',
    genre: '犯罪, 劇情'
  },
  {
    id: 'local-3',
    title: '黑暗騎士',
    releaseDate: '2008',
    director: '克里斯托弗·諾蘭',
    description: '當威脅稱為小丑的恐怖份子出現在高譚市並造成混亂時，蝙蝠俠必須接受他所發現的自己最大的心理和生理考驗之一。',
    posterUrl: 'https://i.imgur.com/gjRGiJh.png',
    detailUrl: 'https://www.imdb.com/title/tt0468569',
    imdbID: 'tt0468569',
    rating: '9.0',
    genre: '動作, 犯罪, 劇情'
  },
  {
    id: 'local-4',
    title: '阿甘正傳',
    releaseDate: '1994',
    director: '羅伯特·澤米吉斯',
    description: '阿拉巴馬州一個智商低下但善良的人的一生。',
    posterUrl: 'https://i.imgur.com/gjRGiJh.png',
    detailUrl: 'https://www.imdb.com/title/tt0109830',
    imdbID: 'tt0109830',
    rating: '8.8',
    genre: '劇情, 浪漫'
  },
  {
    id: 'local-5',
    title: '鐵達尼號',
    releaseDate: '1997',
    director: '詹姆斯·卡梅隆',
    description: '一個十七歲的貴族女孩與一個貧窮的藝術家在1912年4月不幸的首航中墜入愛河。',
    posterUrl: 'https://i.imgur.com/gjRGiJh.png',
    detailUrl: 'https://www.imdb.com/title/tt0120338',
    imdbID: 'tt0120338',
    rating: '7.9',
    genre: '劇情, 浪漫'
  }
];

// 獲取熱門電影 (基於IMDb評分)
export const getTopRatedMovies = async (): Promise<Movie[]> => {
  // 防止服務器端請求
  if (typeof window === 'undefined') {
    return localTopMovies;
  }

  // OMDb API沒有提供獲取熱門電影的直接方法
  // 這裡使用一些固定的IMDb ID來獲取熱門電影
  const topMovieIds = [
    'tt0111161', // 肖申克的救贖
    'tt0068646', // 教父
    'tt0071562', // 教父2
    'tt0468569', // 黑暗騎士
    'tt0050083', // 十二怒漢
    'tt0108052', // 辛德勒的名單
    'tt0167260', // 魔戒三部曲：王者再臨
    'tt0110912', // 低俗小說
    'tt0060196', // 黃金三镖客
    'tt0120737'  // 魔戒首部曲：魔戒現身
  ];
  
  try {
    try {
      // 嘗試並行獲取多部電影
      const moviesPromises = topMovieIds.map(id => getMovieDetails(id).catch(err => {
        console.error(`無法獲取電影 ${id}:`, err);
        // 提供備用數據
        return localTopMovies.find(m => m.imdbID === id) || null;
      }));
      
      // 等待所有請求完成
      const movies = await Promise.all(moviesPromises);
      
      // 過濾掉獲取失敗的電影
      const validMovies = movies.filter(m => m !== null) as Movie[];
      
      // 如果API獲取的電影數量不足，補充本地數據
      if (validMovies.length < 5) {
        console.log('API獲取的電影不足，使用本地數據補充');
        return [
          ...validMovies,
          ...localTopMovies.filter(local => !validMovies.some(valid => valid.imdbID === local.imdbID))
        ].slice(0, 10);
      }
      
      return validMovies;
    } catch (apiError) {
      console.error('API獲取熱門電影失敗，使用本地數據:', apiError);
      // API完全失敗時使用本地數據
      return localTopMovies;
    }
  } catch (error) {
    console.error('獲取熱門電影完全失敗:', error);
    return localTopMovies; // 返回本地數據作為最後的備用選項
  }
};

// 使用關鍵詞獲取電影推薦
export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  // 防止服務器端請求
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    // 這裡使用搜索API以類型作為關鍵詞
    const encodedGenre = encodeURIComponent(genre.trim());
    const url = `${OMDB_BASE_URL}/?s=${encodedGenre}&type=movie`;
    
    const data = await fetchOMDbAPI(url);
    
    if (data.Response === 'False' || !data.Search) {
      console.log(`OMDb搜索類型 "${genre}" 無結果: ${data.Error}`);
      return [];
    }
    
    // 獲取電影詳情
    const detailedMovies = await Promise.all(
      data.Search.slice(0, 10).map(async (movie: any) => {
        try {
          return await getMovieDetails(movie.imdbID);
        } catch (error) {
          console.error(`獲取電影 ${movie.imdbID} 詳情失敗:`, error);
          return convertOmdbToMovie(movie);
        }
      })
    );
    
    return detailedMovies;
  } catch (error) {
    console.error(`獲取${genre}類型電影失敗:`, error);
    return [];
  }
}; 