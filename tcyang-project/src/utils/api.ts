/**
 * 安全的API請求函數，適用於處理電影API調用
 */
export const safeApiRequest = async <T>(url: string): Promise<T> => {
  // 檢查是否在服務器端執行
  if (typeof window === 'undefined') {
    console.warn('safeApiRequest 在服務器端被調用，將返回空資料');
    return {} as T;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}; 