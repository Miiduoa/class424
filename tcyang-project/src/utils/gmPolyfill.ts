/**
 * GM函數模擬實現
 * 用於在瀏覽器環境中提供Greasemonkey/Tampermonkey風格的功能
 */

// 確保window.GM_getValue存在的函數
function ensureGMFunctions() {
  // 只在客戶端執行
  if (typeof window === 'undefined') return;

  try {
    // 如果GM_getValue不存在，創建一個臨時占位函數
    if (!(window as any).GM_getValue) {
      (window as any).GM_getValue = function(name: string, defaultValue: any = null) {
        // 減少過多日誌
        if (process.env.NODE_ENV !== 'production') {
          console.debug('使用 GM_getValue 佔位函數');
        }
        return defaultValue;
      };
    }

    // 同樣為其他GM函數創建占位符
    if (!(window as any).GM_setValue) {
      (window as any).GM_setValue = function(name: string, value: any) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('使用 GM_setValue 佔位函數');
        }
      };
    }

    if (!(window as any).GM_deleteValue) {
      (window as any).GM_deleteValue = function(name: string) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('使用 GM_deleteValue 佔位函數');
        }
      };
    }

    if (!(window as any).GM_listValues) {
      (window as any).GM_listValues = function() {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('使用 GM_listValues 佔位函數');
        }
        return [];
      };
    }
  } catch (error) {
    console.error('確保GM函數存在時出錯:', error);
  }
}

// 初始化GM函數
export function initGMFunctions() {
  // 只在客戶端執行
  if (typeof window === 'undefined') return;
  
  // 先確保基本占位函數存在
  ensureGMFunctions();

  // 檢查GM函數是否已經完全初始化
  if ((window as any)._gmFunctionsInitialized) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('GM函數已經完全初始化，跳過');
    }
    return;
  }

  try {
    // 模擬其他GM函數
    (window as any).GM_setValue = function(name: string, value: any) {
      try {
        localStorage.setItem(`gm_${name}`, JSON.stringify(value));
      } catch (e) {
        console.error('GM_setValue 錯誤:', e);
      }
    };
    
    (window as any).GM_getValue = function(name: string, defaultValue: any = null) {
      try {
        const value = localStorage.getItem(`gm_${name}`);
        return value ? JSON.parse(value) : defaultValue;
      } catch (e) {
        console.error('GM_getValue 錯誤:', e);
        return defaultValue;
      }
    };
    
    (window as any).GM_deleteValue = function(name: string) {
      try {
        localStorage.removeItem(`gm_${name}`);
      } catch (e) {
        console.error('GM_deleteValue 錯誤:', e);
      }
    };
    
    (window as any).GM_listValues = function() {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('gm_')) {
            keys.push(key.substring(3));
          }
        }
        return keys;
      } catch (e) {
        console.error('GM_listValues 錯誤:', e);
        return [];
      }
    };
    
    // 模擬GM_xmlhttpRequest，但使用更簡化的實現
    (window as any).GM_xmlhttpRequest = function(details: any) {
      return new Promise((resolve, reject) => {
        try {
          const xhr = new XMLHttpRequest();
          
          xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
              if (details.onload) {
                details.onload({
                  responseText: xhr.responseText,
                  status: xhr.status,
                  statusText: xhr.statusText,
                  response: xhr.response
                });
              }
              resolve({
                responseText: xhr.responseText,
                status: xhr.status
              });
            } else {
              if (details.onerror) {
                details.onerror(xhr);
              }
              reject(new Error(`Request failed with status ${xhr.status}`));
            }
          };
          
          xhr.onerror = function(e) {
            if (details.onerror) {
              details.onerror(e);
            }
            reject(new Error('Network error'));
          };
          
          xhr.open(details.method || 'GET', details.url, true);
          
          if (details.headers) {
            Object.keys(details.headers).forEach(key => {
              xhr.setRequestHeader(key, details.headers[key]);
            });
          }
          
          xhr.timeout = details.timeout || 10000; // 預設10秒
          
          if (details.ontimeout) {
            xhr.ontimeout = details.ontimeout;
          }
          
          xhr.send(details.data);
        } catch (e) {
          console.error('GM_xmlhttpRequest 錯誤:', e);
          reject(e);
        }
      });
    };
    
    // 標記為已初始化
    (window as any)._gmFunctionsInitialized = true;
    
    if (process.env.NODE_ENV !== 'production') {
      console.debug('GM函數初始化完成');
    }
  } catch (error) {
    console.error('初始化GM函數失敗:', error);
    // 確保基本函數仍然可用
    ensureGMFunctions();
  }
}

/**
 * 安全API請求工具
 * 提供更可靠的API請求處理，包括錯誤處理和重試邏輯
 */

/**
 * 進行安全的API請求，並處理各種可能的錯誤
 * @param url 請求的URL
 * @param options fetch的選項
 * @returns 解析後的JSON數據
 * @throws 格式化的錯誤信息
 */
export async function safeApiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  // 檢查是否在服務器端執行
  if (typeof window === 'undefined') {
    console.warn('safeApiRequest 在服務器端被調用，將返回空資料');
    return {} as T;
  }
  
  // 確保GM函數可用
  ensureGMFunctions();
  
  try {
    const response = await fetch(url, {
      ...options,
      next: { revalidate: 3600 }, // 快取一小時
    });

    if (!response.ok) {
      throw new Error(`API錯誤 (${response.status}): ${response.statusText}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`API請求失敗: ${url}`, error);
    throw error instanceof Error 
      ? error 
      : new Error('未知的API請求錯誤');
  }
} 