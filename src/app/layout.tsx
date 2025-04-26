import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '課程專案',
  description: '課程專案網站',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
} 