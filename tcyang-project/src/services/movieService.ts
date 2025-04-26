import { Movie } from '@/types';
import { safeApiRequest } from '@/utils/gmPolyfill';

// OMDb API設定
const OMDB_API_KEY = 'f1592956'; // 這是示例API Key，請替換為您自己的
const OMDB_API_URL = 'https://www.omdbapi.com/';

/**
 * 從OMDb API搜尋結果映射到應用程式的Movie類型
 */
function mapOmdbMovieToMovie(omdbMovie: any): Movie {
  return {
    id: omdbMovie.imdbID,
    imdbID: omdbMovie.imdbID,
    title: omdbMovie.Title,
    releaseDate: omdbMovie.Year,
    director: omdbMovie.Director || 'Unknown',
    description: omdbMovie.Plot || 'No description available',
    posterUrl: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : undefined,
    detailUrl: `https://www.imdb.com/title/${omdbMovie.imdbID}/`,
    rating: omdbMovie.imdbRating !== 'N/A' ? omdbMovie.imdbRating : undefined,
    genre: omdbMovie.Genre !== 'N/A' ? omdbMovie.Genre : undefined,
  };
}

/**
 * 電影服務類別 - 處理與OMDb API的所有交互
 */
export class MovieService {
  /**
   * 依據關鍵字搜尋電影
   * @param query 搜尋關鍵字
   * @param page 頁碼 (OMDb API從1開始計數)
   * @returns 電影列表與搜尋結果總數
   */
  static async searchMovies(query: string, page: number = 1): Promise<{ movies: Movie[], totalResults: number }> {
    if (!query.trim()) {
      return { movies: [], totalResults: 0 };
    }

    const searchUrl = `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
    
    try {
      const data = await safeApiRequest<any>(searchUrl);
      
      if (data.Response === 'False') {
        console.log('OMDb API搜尋無結果:', data.Error);
        return { movies: [], totalResults: 0 };
      }
      
      // 映射電影資料到應用程式的Movie類型
      const movies: Movie[] = data.Search.map(mapOmdbMovieToMovie);
      return { 
        movies, 
        totalResults: parseInt(data.totalResults, 10) 
      };
    } catch (error) {
      console.error('搜尋電影時發生錯誤:', error);
      throw new Error('無法完成電影搜尋，請稍後再試');
    }
  }

  /**
   * 獲取電影詳細資料
   * @param imdbId IMDb ID
   * @returns 電影詳細資料
   */
  static async getMovieDetails(imdbId: string): Promise<Movie> {
    if (!imdbId) {
      throw new Error('需要有效的IMDb ID');
    }

    const detailUrl = `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`;
    
    try {
      const data = await safeApiRequest<any>(detailUrl);
      
      if (data.Response === 'False') {
        throw new Error(data.Error || '找不到電影詳細資料');
      }
      
      return mapOmdbMovieToMovie(data);
    } catch (error) {
      console.error('獲取電影詳細資料時發生錯誤:', error);
      throw new Error('無法獲取電影詳細資料，請稍後再試');
    }
  }

  /**
   * 獲取熱門或高評分電影 (使用預設關鍵字)
   * @returns 推薦電影列表
   */
  static async getRecommendedMovies(): Promise<Movie[]> {
    // 使用一些熱門關鍵字搜尋高評分電影
    try {
      // 使用"Marvel"作為示例關鍵字
      const { movies } = await this.searchMovies('Marvel', 1);
      return movies;
    } catch (error) {
      console.error('獲取推薦電影時發生錯誤:', error);
      return [];
    }
  }
} 