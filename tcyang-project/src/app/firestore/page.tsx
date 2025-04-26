'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllTeachers } from '@/services/firestore';
import { Teacher } from '@/types';

export default function FirestoreData() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersList = await getAllTeachers();
        setTeachers(teachersList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('讀取 Firestore 資料時發生錯誤。請確認 Firebase 設定是否正確。');
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="py-8">
      <h1>讀取Firestore資料</h1>
      
      <div className="my-6">
        {loading ? (
          <p>載入中...</p>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-300 rounded">
            <p className="text-red-700">{error}</p>
            <p className="mt-2 text-sm">
              請確認您已經正確設定 Firebase 設定檔，並在 Firestore 中建立了 teachers 集合。
            </p>
          </div>
        ) : teachers.length === 0 ? (
          <p>目前沒有教師資料</p>
        ) : (
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
        )}
      </div>

      <Link href="/" className="mt-4 inline-block p-2 bg-blue-500 text-white rounded">
        回首頁
      </Link>
    </div>
  );
} 