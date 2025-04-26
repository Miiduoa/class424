import { Accident } from '@/types';

// 台中市114年01月份十大易肇事路段資料
// 實際應用中應該從 https://data.gov.tw/dataset/173126 獲取資料
// 此處使用模擬數據
export const getAccidentData = async (): Promise<Accident[]> => {
  try {
    // 實際應用中，這裡應該向API發送請求
    // 例如：const response = await fetch('https://your-api-endpoint');
    
    // 模擬從API取得的資料
    const mockAccidentData: Accident[] = [
      { 
        id: 1, 
        location: '中港路與忠明南路口', 
        count: 15, 
        severity: '輕傷',
        description: '主要發生於尖峰時段，多為未保持安全距離導致的追撞事故',
        cause: '未保持安全距離、未注意前方車輛狀態',
        vehicles: '汽機車',
        weather: '晴天',
        date: '2025/01/15',
        latitude: 24.164520,
        longitude: 120.647320
      },
      { 
        id: 2, 
        location: '文心路與河南路口', 
        count: 12, 
        severity: '重傷',
        description: '交通號誌複雜，車流量大，易發生側撞事故',
        cause: '未依規定讓車、闖紅燈',
        vehicles: '汽機車、大客車',
        weather: '晴天',
        date: '2025/01/10',
        latitude: 24.160670,
        longitude: 120.646110
      },
      { 
        id: 3, 
        location: '中清路與文心路口', 
        count: 10, 
        severity: '輕傷',
        description: '商圈周邊人潮眾多，機車與行人交錯複雜',
        cause: '違規轉彎、未禮讓行人',
        vehicles: '機車、行人',
        weather: '晴天',
        date: '2025/01/05',
        latitude: 24.179880,
        longitude: 120.646330
      },
      { 
        id: 4, 
        location: '台灣大道與河南路口', 
        count: 9, 
        severity: '重傷',
        description: '車流量大，道路寬闊，車速較快導致事故嚴重性提高',
        cause: '超速、違規超車',
        vehicles: '汽車、機車、自行車',
        weather: '晴天',
        date: '2025/01/12',
        latitude: 24.166450,
        longitude: 120.647100
      },
      { 
        id: 5, 
        location: '漢口路與五權路口', 
        count: 8, 
        severity: '死亡',
        description: '夜間照明不足，加上路口複雜，曾發生重大死亡車禍',
        cause: '酒後駕車、闖紅燈',
        vehicles: '汽車、機車',
        weather: '雨天',
        date: '2025/01/03',
        latitude: 24.144240,
        longitude: 120.667640
      },
      { 
        id: 6, 
        location: '中港路與惠中路口', 
        count: 7, 
        severity: '輕傷',
        description: '購物中心附近，車輛進出頻繁',
        cause: '未注意路況、違規停車',
        vehicles: '汽車',
        weather: '晴天',
        date: '2025/01/17',
        latitude: 24.165910,
        longitude: 120.662710
      },
      { 
        id: 7, 
        location: '文心路與公益路口', 
        count: 6, 
        severity: '重傷',
        description: '商辦大樓密集區域，上下班時段車流量大',
        cause: '違規轉彎、未保持安全距離',
        vehicles: '汽機車',
        weather: '多雲',
        date: '2025/01/09',
        latitude: 24.151840,
        longitude: 120.648590
      },
      { 
        id: 8, 
        location: '中清路與崇德路口', 
        count: 5, 
        severity: '輕傷',
        description: '住宅區與學校附近，學生通勤時間易發生事故',
        cause: '未依規定讓車、違規超速',
        vehicles: '機車、自行車',
        weather: '晴天',
        date: '2025/01/24',
        latitude: 24.178600,
        longitude: 120.681350
      },
      { 
        id: 9, 
        location: '台灣大道與文心路口', 
        count: 5, 
        severity: '死亡',
        description: '台中市最大十字路口之一，車流量大且複雜',
        cause: '闖紅燈、未保持安全距離',
        vehicles: '大貨車、機車',
        weather: '晴天',
        date: '2025/01/20',
        latitude: 24.163760,
        longitude: 120.646290
      },
      { 
        id: 10, 
        location: '中港路與文心路口', 
        count: 4, 
        severity: '重傷',
        description: '商圈密集區域，車流人流複雜',
        cause: '違規轉彎、未禮讓行人',
        vehicles: '汽車、機車',
        weather: '陰天',
        date: '2025/01/14',
        latitude: 24.165090,
        longitude: 120.646870
      },
      { 
        id: 11, 
        location: '北屯路與崇德路口', 
        count: 7, 
        severity: '輕傷',
        description: '北屯區域主要十字路口，車流量大',
        cause: '未保持安全距離、違規超車',
        vehicles: '汽機車',
        weather: '晴天',
        date: '2025/01/22',
        latitude: 24.172350,
        longitude: 120.686250
      },
      { 
        id: 12, 
        location: '西屯路與黎明路口', 
        count: 6, 
        severity: '重傷',
        description: '西屯區主要路口，晨昏時段視線不佳',
        cause: '視線不良、違規轉彎',
        vehicles: '汽車、機車',
        weather: '晴天',
        date: '2025/01/19',
        latitude: 24.179230,
        longitude: 120.623470
      },
      { 
        id: 13, 
        location: '精武路與進化路口', 
        count: 5, 
        severity: '死亡',
        description: '北區重要路口，曾發生多起死亡車禍',
        cause: '酒後駕車、超速行駛',
        vehicles: '汽車、機車',
        weather: '雨天',
        date: '2025/01/08',
        latitude: 24.158120,
        longitude: 120.672810
      },
      { 
        id: 14, 
        location: '南屯路與五權西路口', 
        count: 4, 
        severity: '輕傷',
        description: '南屯區主要路口，商業活動頻繁',
        cause: '違規停車、未注意車前狀態',
        vehicles: '汽車、機車',
        weather: '晴天',
        date: '2025/01/26',
        latitude: 24.142370,
        longitude: 120.643270
      },
      { 
        id: 15, 
        location: '復興路與太原路口', 
        count: 3, 
        severity: '輕傷',
        description: '東區主要路口，交通流量中等',
        cause: '違規轉彎、未保持安全距離',
        vehicles: '機車',
        weather: '晴天',
        date: '2025/01/30',
        latitude: 24.142760,
        longitude: 120.684520
      }
    ];
    
    return mockAccidentData;
  } catch (error) {
    console.error('Error fetching accident data:', error);
    throw error;
  }
};

// 根據關鍵字搜尋易肇事路段
export const searchAccidentData = async (keyword: string): Promise<Accident[]> => {
  try {
    const allData = await getAccidentData();
    
    // 如果關鍵字為空，返回所有資料
    if (!keyword.trim()) {
      return allData;
    }
    
    // 根據關鍵字過濾資料（包含位置、描述和原因）
    return allData.filter(accident => 
      accident.location.includes(keyword) || 
      (accident.description && accident.description.includes(keyword)) ||
      (accident.cause && accident.cause.includes(keyword))
    );
  } catch (error) {
    console.error('Error searching accident data:', error);
    throw error;
  }
}; 