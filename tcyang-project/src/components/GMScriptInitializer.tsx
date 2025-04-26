'use client';

import { useEffect, useState } from 'react';
import { initGMFunctions } from '@/utils/gmPolyfill';

interface WindowWithGM extends Window {
  GM_getValue?: (key: string, defaultValue?: any) => any;
  GM_setValue?: (key: string, value: any) => void;
  GM_deleteValue?: (key: string) => void;
  GM_listValues?: () => string[];
  GM_xmlhttpRequest?: (details: any) => Promise<any>;
}

export default function GMScriptInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);

  // 在客戶端初始化 GM 函數
  useEffect(() => {
    const initGM = () => {
      try {
        // 確保只在瀏覽器環境執行
        if (typeof window === 'undefined') return;
        
        // 先定义一个全局方法避免错误
        const win = window as WindowWithGM;
        
        // 提前定義佔位函數以避免可能的錯誤
        if (!win.GM_getValue) {
          win.GM_getValue = (key: string, defaultValue: any = null) => {
            // 避免日誌噪音
            if (process.env.NODE_ENV !== 'production') {
              console.log('Using temporary GM_getValue placeholder');
            }
            return defaultValue;
          };
        }
        
        if (!isInitialized) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Initializing GM functions...');
          }
          initGMFunctions();
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing GM functions:', error);
        // 出錯時不設置 isInitialized，這樣可以下次重試
      }
    };

    // 使用 setTimeout 確保在所有其他 useEffect 之後執行
    const timer = setTimeout(initGM, 0);
    
    return () => {
      clearTimeout(timer);
    };
  }, [isInitialized]);

  // 不需要渲染任何內容
  return null;
} 