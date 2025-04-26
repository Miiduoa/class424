'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Nickname() {
  const [nickname, setNickname] = useState('');
  const [submittedNickname, setSubmittedNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedNickname(nickname);
  };

  return (
    <div className="py-8">
      <h1>傳送使用者暱稱</h1>
      
      <form onSubmit={handleSubmit} className="my-4">
        <div className="mb-4">
          <label htmlFor="nickname" className="block mb-2">請輸入您的暱稱：</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button 
          type="submit" 
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          送出
        </button>
      </form>
      
      {submittedNickname && (
        <div className="my-4 p-4 bg-green-100 border border-green-300 rounded">
          <p>您好，<span className="font-bold">{submittedNickname}</span>！歡迎您的到來。</p>
        </div>
      )}

      <Link href="/" className="mt-4 inline-block p-2 bg-blue-500 text-white rounded">
        回首頁
      </Link>
    </div>
  );
} 