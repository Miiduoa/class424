// 教師資料結構
export interface Teacher {
  id?: string;
  name: string;
  department: string;
  position: string;
}

/**
 * 電影介面定義
 */
export interface Movie {
  id: string;
  imdbID?: string;
  tmdbId?: number;  // TMDB電影ID
  title: string;
  originalTitle?: string;  // 原始標題（非翻譯）
  releaseDate?: string;
  director?: string;
  actors?: string;        // 演員列表
  description?: string;
  plot?: string;          // 詳細劇情
  posterUrl?: string;
  detailUrl?: string;
  rating?: string;        // IMDb 評分
  genre?: string;         // 電影類型
  language?: string;      // 語言
  country?: string;       // 製作國家
  runtime?: string;       // 片長
  boxOffice?: string;    // 票房
  awards?: string;       // 獲獎情況
  metascore?: string;    // Metacritic 評分
}

/**
 * 電影搜尋結果介面
 */
export interface MovieSearchResults {
  movies: Movie[];
  totalResults: number;
  currentPage: number;
}

/**
 * 交通事故資料結構
 */
export interface Accident {
  id: number;
  location: string;      // 事故地點
  count: number;         // 事故次數
  severity: string;      // 嚴重程度（輕傷、重傷、死亡）
  description?: string;  // 事故詳細描述
  cause?: string;        // 事故原因
  vehicles?: string;     // 涉及車輛類型
  weather?: string;      // 事故發生時的天氣狀況
  latitude?: number;     // 經度
  longitude?: number;    // 緯度
  date?: string;         // 事故日期
} 