import { Movie, MovieSearchResults } from '@/types';
import { safeApiRequest } from './api';

// OMDb API base URL
const OMDB_API_URL = 'https://www.omdbapi.com/';
// 需要替換為您自己的API密鑰
const API_KEY = '38158e27';

interface OMDbResponse {
  Search?: Array<{
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
  }>;
  totalResults?: string;
  Response: string;
  Error?: string;
}

interface OMDbDetailResponse {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

/**
 * 轉換OMDb API回應為標準電影對象
 */
const mapOMDbToMovie = (item: {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}): Movie => {
  return {
    id: item.imdbID,
    imdbID: item.imdbID,
    title: item.Title,
    releaseDate: item.Year,
    posterUrl: item.Poster !== 'N/A' ? item.Poster : '/placeholder.png',
    detailUrl: `/movie-imdb/${item.imdbID}`,
  };
};

/**
 * 轉換OMDb詳情API回應為標準電影詳情對象
 */
const mapOMDbDetailToMovie = (data: OMDbDetailResponse): Movie => {
  return {
    id: data.imdbID,
    imdbID: data.imdbID,
    title: data.Title,
    plot: data.Plot,
    releaseDate: data.Released,
    posterUrl: data.Poster !== 'N/A' ? data.Poster : '/placeholder.png',
    genre: data.Genre,
    rating: data.imdbRating,
    runtime: data.Runtime,
    director: data.Director,
    actors: data.Actors,
    country: data.Country,
    language: data.Language,
    awards: data.Awards,
    boxOffice: data.BoxOffice,
    metascore: data.Metascore
  };
};

/**
 * 搜索電影
 * @param query 搜索詞
 * @param page 頁碼
 */
export const searchMovies = async (query: string, page = 1): Promise<MovieSearchResults> => {
  if (!query.trim()) {
    return { movies: [], totalResults: 0, currentPage: page };
  }

  const url = `${OMDB_API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  
  try {
    const data = await safeApiRequest<OMDbResponse>(url);
    
    if (data.Response === 'False') {
      console.error('OMDb API error:', data.Error);
      return { movies: [], totalResults: 0, currentPage: page };
    }
    
    const movies = data.Search?.map(mapOMDbToMovie) || [];
    const totalResults = parseInt(data.totalResults || '0', 10);
    
    return {
      movies,
      totalResults,
      currentPage: page
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { movies: [], totalResults: 0, currentPage: page };
  }
};

/**
 * 通過ID獲取電影詳情
 * @param id 電影ID（IMDB ID）
 */
export const getMovieById = async (id: string): Promise<Movie | null> => {
  if (!id) return null;
  
  const url = `${OMDB_API_URL}?apikey=${API_KEY}&i=${id}&plot=full`;
  
  try {
    const data = await safeApiRequest<OMDbDetailResponse>(url);
    
    if (data.Response === 'False') {
      console.error('OMDb API error when fetching movie details');
      return null;
    }
    
    return mapOMDbDetailToMovie(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}; 