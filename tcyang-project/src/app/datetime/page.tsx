'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DateTime() {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
      const formattedTime = now.toLocaleTimeString('zh-TW');
      setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          marginBottom: '15px',
          color: '#212529'
        }}>
          顯示日期時間
        </h1>
      </header>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        fontSize: '20px',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#007bff',
        fontWeight: '500'
      }}>
        {currentDateTime}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link 
          href="/" 
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          回首頁
        </Link>
      </div>

      <footer style={{ 
        marginTop: '40px', 
        borderTop: '1px solid #dee2e6',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#6c757d',
        fontSize: '14px'
      }}>
        <p>© 2025 顧晉瑋. 使用Next.js與React構建.</p>
      </footer>
    </div>
  );
} 