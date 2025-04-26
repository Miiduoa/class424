'use client';

import Link from 'next/link';
import { useState } from 'react';
import { searchTeachers } from '@/services/firestore';
import { Teacher } from '@/types';

export default function TeacherSearch() {
  const [keyword, setKeyword] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      setError('請輸入搜尋關鍵字');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await searchTeachers(keyword);
      setTeachers(results);
      setSearched(true);
    } catch (err) {
      console.error('Error searching teachers:', err);
      setError('搜尋時發生錯誤。請確認 Firebase 設定是否正確。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h1>根據關鍵字,查詢教師資料</h1>
      
      <form onSubmit={handleSearch} className="my-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="請輸入關鍵字"
            />
          </div>
          <button 
            type="submit" 
            className="py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? '搜尋中...' : '搜尋'}
          </button>
        </div>
        
        {error && (
          <p className="mt-2 text-red-600">{error}</p>
        )}
      </form>
      
      {searched && (
        <div className="my-6">
          {teachers.length === 0 ? (
            <p>沒有找到符合關鍵字「{keyword}」的教師資料</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-3">搜尋結果：</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">姓名</th>
                      <th className="py-2 px-4 border">系所</th>
                      <th className="py-2 px-4 border">職稱</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="py-2 px-4 border">{teacher.name}</td>
                        <td className="py-2 px-4 border">{teacher.department}</td>
                        <td className="py-2 px-4 border">{teacher.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <Link href="/" className="mt-4 inline-block p-2 bg-blue-500 text-white rounded">
        回首頁
      </Link>
    </div>
  );
} 