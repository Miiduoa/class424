/** @type {import('next').NextConfig} */
const nextConfig = {
  // 靜態導出選項移除，改為常規 Next.js 應用
  // output: 'export',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'http',
        hostname: 'img.omdbapi.com',
      },
      {
        protocol: 'https',
        hostname: 'img.omdbapi.com',
      },
      // Common domains for movie posters
      {
        protocol: 'https',
        hostname: 'ia.media-imdb.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: '*.ssl-images-amazon.com',
      },
      // Allow any domain for troubleshooting
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 增加圖片請求超時時間
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Disable image optimization since it's causing issues
    unoptimized: true,
  },
  // Add strict mode to help identify problems
  reactStrictMode: true,
  
  // Allow cross-origin requests during development
  transpilePackages: ['react-icons'],
  
  // 禁用ESlint檢查（僅在開發環境）
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 