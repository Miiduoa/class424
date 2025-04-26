import Link from 'next/link';

export default function MIS() {
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
          MIS 資訊管理學系
        </h1>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '4px solid #007bff'
        }}>
          <p style={{ margin: '0 0 8px 0', color: '#212529' }}>國立台中科技大學 資訊管理系</p>
          <p style={{ margin: '0 0 8px 0', color: '#6c757d' }}>National Taichung University of Science and Technology</p>
          <p style={{ margin: '0', color: '#6c757d' }}>Department of Information Management</p>
        </div>
      </header>

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