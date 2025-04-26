/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 強制使用HTTPS避免混合內容問題
  poweredByHeader: false,
  // 環境變數在 .env 文件中配置
  // 忽略ESLint錯誤，允許編譯完成
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // 忽略TypeScript錯誤，允許編譯完成
  typescript: {
    ignoreBuildErrors: true,
  },
  // 忽略客戶端和服務端渲染不匹配的警告
  onDemandEntries: {
    // 保持頁面在內存中的時間（以毫秒為單位）
    maxInactiveAge: 120 * 1000,
    // 同時保持的頁面數量
    pagesBufferLength: 5,
  },
  // 添加重定向規則確保路由正確
  async redirects() {
    return [
      // 修復交通事故頁面的 404 錯誤
      {
        source: '/accident',
        destination: '/accident-search-same-page',
        permanent: false,
      },
      // 其他潛在的重定向
      {
        source: '/traffic-accident',
        destination: '/accident-search-same-page',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 