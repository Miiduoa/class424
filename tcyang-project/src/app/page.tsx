'use client';

import { useState, useEffect } from 'react'
import { FiClock, FiCalendar, FiBook, FiVideo, FiUsers, FiPieChart, FiGrid, FiLayers, FiFilter, FiMapPin, FiAlertTriangle } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const formattedDateTime = now.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setCurrentDateTime(formattedDateTime)
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'media', name: '媒體' },
    { id: 'technology', name: '技術' },
    { id: 'data', name: '資料' },
  ]

  const features = [
    {
      id: 1,
      title: '個人簡介',
      description: '詳細介紹顧晉瑋的專業背景、開發技能與專案成果',
      icon: <FiUsers className="w-6 h-6" />,
      category: 'media',
      link: '/introduction',
    },
    {
      id: 2,
      title: '電影資料庫',
      description: '使用OMDB API，輸入關鍵字查詢電影資訊',
      icon: <FiVideo className="w-6 h-6" />,
      category: 'media',
      link: '/movie-imdb',
    },
    {
      id: 3,
      title: '表單資料處理',
      description: '網頁表單傳值與使用者暱稱傳送功能展示',
      icon: <FiBook className="w-6 h-6" />,
      category: 'data',
      link: '/form',
    },
    {
      id: 4,
      title: '交通事故資料(同頁)',
      description: '查詢114年1月台中十大易肇事路口資料(同頁顯示)',
      icon: <FiPieChart className="w-6 h-6" />,
      category: 'data',
      link: '/accident-search-same-page',
    },
    {
      id: 5,
      title: '交通事故搜尋',
      description: '查詢交通事故資料，以獨立結果頁顯示詳細資訊',
      icon: <FiAlertTriangle className="w-6 h-6" />,
      category: 'data',
      link: '/accident-search',
    },
    {
      id: 6,
      title: '即將上映電影',
      description: '擷取開眼電影網即將上映電影，存取資料庫',
      icon: <FiGrid className="w-6 h-6" />,
      category: 'technology',
      link: '/movie-fetch',
    },
    {
      id: 7,
      title: '教師資料查詢',
      description: '根據關鍵字查詢教師資料，展示API應用',
      icon: <FiLayers className="w-6 h-6" />,
      category: 'technology',
      link: '/teacher-search',
    },
  ]

  const filteredFeatures = activeCategory === 'all'
    ? features
    : features.filter(feature => feature.category === activeCategory)

  return (
    <main className="min-h-screen pt-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[rgba(var(--accent),0.05)] to-transparent px-4 py-16 md:py-24 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div style={{ maxWidth: "32rem" }} className="">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">顧晉瑋</span> 的個人網站
              </h1>
              <p className="text-[rgba(var(--foreground),0.8)] text-lg md:text-xl mb-8">
                歡迎來到我的個人網站，這裡展示了我的網頁開發技能、資訊管理系統設計以及資料處理成果。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/introduction" className="btn btn-primary">
                  個人簡介
                </Link>
                <Link href="/movie-imdb" className="btn btn-outline">
                  電影資料庫
                </Link>
              </div>
            </div>
            <div className="relative w-full p-6 rounded-lg border border-[rgba(var(--border),0.5)] backdrop-blur-sm card-hover bg-[rgba(var(--secondary),0.5)]" style={{ maxWidth: "24rem" }}>
              <div className="mb-4 flex items-center gap-2 text-[rgba(var(--foreground),0.7)]">
                <FiClock className="w-5 h-5" />
                <FiCalendar className="w-5 h-5" />
                <span className="text-sm">當前日期和時間</span>
              </div>
              <div className="text-xl font-medium text-[rgb(var(--foreground))]">
                {currentDateTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-center inline-block relative">
              網站功能
            </h2>
            <p className="section-subtitle mx-auto">
              探索網站提供的各種功能和資源，展示資訊管理系統開發的各種技術應用
            </p>
            
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    activeCategory === category.id
                      ? 'bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))]'
                      : 'bg-[rgba(var(--secondary),0.5)] text-[rgba(var(--foreground),0.7)] hover:text-[rgb(var(--foreground))]'
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature) => (
              <Link href={feature.link} key={feature.id}>
                <div className="h-full p-6 bg-[rgba(var(--background),1)] border border-[rgba(var(--border),0.5)] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 card-hover">
                  <div className="feature-icon mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[rgba(var(--foreground),0.7)] mb-4">{feature.description}</p>
                  <div className="mt-auto">
                    <span className="badge badge-primary">{categories.find(c => c.id === feature.category)?.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[rgba(var(--secondary),0.3)]">
        <div className="container mx-auto px-4">
          <div className="text-center mx-auto" style={{ maxWidth: "48rem" }}>
            <h2 className="section-title">聯絡顧晉瑋</h2>
            <p className="section-subtitle mx-auto">
              如果您有任何問題或想進一步了解我的開發技能與專案，歡迎與我聯繫
            </p>
            <div className="mt-8">
              <Link href="/form" className="btn btn-primary btn-lg">
                聯絡表單
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
