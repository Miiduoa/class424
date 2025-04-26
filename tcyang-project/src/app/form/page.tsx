'use client';

import Link from 'next/link';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactForm() {
  const router = useRouter();
  
  // 表單數據狀態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // 表單狀態
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    hasErrors: false,
    errors: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    touched: {
      name: false,
      email: false,
      subject: false,
      message: false
    }
  });

  // 驗證函數 - 認知流暢性原理：清晰明確的錯誤訊息幫助用戶理解和修正
  const validate = () => {
    const errors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
    let hasErrors = false;

    // 名稱驗證
    if (!formData.name.trim()) {
      errors.name = '請輸入您的姓名';
      hasErrors = true;
    } else if (formData.name.trim().length < 2) {
      errors.name = '姓名至少需要2個字元';
      hasErrors = true;
    }

    // Email驗證
    if (!formData.email.trim()) {
      errors.email = '請輸入您的Email';
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '請輸入有效的Email格式';
      hasErrors = true;
    }

    // 主旨驗證
    if (!formData.subject.trim()) {
      errors.subject = '請輸入主旨';
      hasErrors = true;
    }

    // 訊息驗證
    if (!formData.message.trim()) {
      errors.message = '請輸入您的訊息';
      hasErrors = true;
    } else if (formData.message.trim().length < 10) {
      errors.message = '訊息至少需要10個字元';
      hasErrors = true;
    }

    return { errors, hasErrors };
  };

  // 處理輸入變更
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFormStatus(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true
      }
    }));
    
    // 即時驗證 - 避免認知摩擦，提供即時回饋
    if (formStatus.touched[name as keyof typeof formStatus.touched]) {
      const { errors } = validate();
      setFormStatus(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: errors[name as keyof typeof errors]
        }
      }));
    }
  };

  // 處理表單提交
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 驗證表單
    const { errors, hasErrors } = validate();
    
    if (hasErrors) {
      // 設置所有欄位為已觸碰，以顯示所有錯誤
      setFormStatus(prev => ({
        ...prev,
        hasErrors,
        errors,
        touched: {
          name: true,
          email: true,
          subject: true,
          message: true
        }
      }));
      return;
    }
    
    // 開始提交
    setFormStatus(prev => ({
      ...prev,
      isSubmitting: true,
      hasErrors: false
    }));
    
    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 重定向到結果頁面
      const params = new URLSearchParams(formData as Record<string, string>);
      router.push(`/form-result?${params.toString()}`);
    } catch (error) {
      setFormStatus(prev => ({
        ...prev,
        isSubmitting: false,
        hasErrors: true
      }));
    }
  };

  // 檢查欄位是否有效 - 用於視覺反饋
  const isFieldValid = (fieldName: keyof typeof formData) => {
    return formStatus.touched[fieldName] && !formStatus.errors[fieldName];
  };

  // 檢查欄位是否有錯誤 - 用於視覺反饋
  const hasFieldError = (fieldName: keyof typeof formData) => {
    return formStatus.touched[fieldName] && !!formStatus.errors[fieldName];
  };

  const subjectOptions = [
    { value: '', label: '請選擇主旨類型' },
    { value: '合作邀請', label: '合作邀請' },
    { value: '專案諮詢', label: '專案諮詢' },
    { value: '網站問題', label: '網站問題' },
    { value: '一般問題', label: '一般問題' },
    { value: '其他', label: '其他' }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">聯絡我們</h1>
          <div className="h-1 w-16 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我們重視您的每一個意見和建議。請填寫以下表單，我們將盡快與您聯繫。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="inline-block w-2 h-6 bg-blue-600 mr-3"></span>
                聯絡資訊
              </h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">辦公地址</h3>
                    <p className="mt-1 text-gray-600">台北市大安區復興南路一段390號 2樓</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">電子郵件</h3>
                    <p className="mt-1 text-gray-600">
                      <a href="mailto:miiduoa@icloud.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                        miiduoa@icloud.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">聯絡電話</h3>
                    <p className="mt-1 text-gray-600">
                      <a href="tel:+886227001234" className="text-blue-600 hover:text-blue-800 transition-colors">
                        (02) 2700-1234
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">營業時間</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 flex justify-between">
                    <span>週一至週五:</span>
                    <span className="font-medium">9:00 - 18:00</span>
                  </p>
                  <p className="text-gray-600 flex justify-between">
                    <span>週六:</span>
                    <span className="font-medium">10:00 - 15:00</span>
                  </p>
                  <p className="text-gray-600 flex justify-between">
                    <span>週日:</span>
                    <span className="font-medium">休息</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="inline-block w-2 h-6 bg-blue-600 mr-3"></span>
                表單資訊
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 ${
                        hasFieldError('name') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      } ${isFieldValid('name') ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}`}
                      placeholder="請輸入您的姓名"
                      autoComplete="name"
                      aria-describedby={hasFieldError('name') ? 'name-error' : undefined}
                    />
                    {hasFieldError('name') && (
                      <p className="mt-1 text-sm text-red-600" id="name-error">
                        {formStatus.errors.name}
                      </p>
                    )}
                    {isFieldValid('name') && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 ${
                        hasFieldError('email') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      } ${isFieldValid('email') ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}`}
                      placeholder="請輸入您的Email"
                      autoComplete="email"
                      aria-describedby={hasFieldError('email') ? 'email-error' : undefined}
                    />
                    {hasFieldError('email') && (
                      <p className="mt-1 text-sm text-red-600" id="email-error">
                        {formStatus.errors.email}
                      </p>
                    )}
                    {isFieldValid('email') && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  主旨 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 ${
                      hasFieldError('subject') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    } ${isFieldValid('subject') ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}`}
                    placeholder="請輸入主旨"
                    aria-describedby={hasFieldError('subject') ? 'subject-error' : undefined}
                  />
                  {hasFieldError('subject') && (
                    <p className="mt-1 text-sm text-red-600" id="subject-error">
                      {formStatus.errors.subject}
                    </p>
                  )}
                  {isFieldValid('subject') && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  訊息內容 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 ${
                      hasFieldError('message') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    } ${isFieldValid('message') ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}`}
                    placeholder="請輸入您的訊息內容"
                    aria-describedby={hasFieldError('message') ? 'message-error' : undefined}
                  />
                  {hasFieldError('message') && (
                    <p className="mt-1 text-sm text-red-600" id="message-error">
                      {formStatus.errors.message}
                    </p>
                  )}
                  {isFieldValid('message') && (
                    <div className="absolute top-3 right-3 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                  <span>請詳細描述您的需求，以便我們更好地為您服務</span>
                  <span>{formData.message.length} / 500 字元</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <p className="text-xs text-gray-500">
                  提交此表單即表示您同意我們的 
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 transition-colors">
                    隱私權政策
                  </Link>
                </p>
                
                <button
                  type="submit"
                  disabled={formStatus.isSubmitting}
                  className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5 ${
                    formStatus.isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {formStatus.isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      處理中...
                    </>
                  ) : (
                    '送出表單'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">常見問題</h2>
            <div className="h-1 w-16 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我們收集了一些常見問題的回答，希望能幫助您解決疑惑
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">提交表單後多久會收到回覆？</h3>
              <p className="text-gray-600">
                我們會在1-2個工作日內回覆您的訊息。若為緊急事項，建議您直接撥打聯絡電話與我們聯繫。
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">如何更改已提交的資料？</h3>
              <p className="text-gray-600">
                若需修改已提交的資料，請再次填寫表單並在訊息中註明您希望更新之前的提交，或直接與我們的客服部門聯繫。
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">我的個人資料如何被保護？</h3>
              <p className="text-gray-600">
                我們嚴格遵守隱私權政策保護您的個人資料，不會將您的資訊用於未經授權的用途或分享給第三方。詳情請參閱我們的隱私權政策。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 