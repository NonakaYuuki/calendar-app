// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'サイドバー付きアプリ',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 text-gray-900">
        <div className="flex min-h-screen">
          {/* サイドバー */}
          <aside className="w-64 bg-blue-800 text-white p-4 hidden md:block">
            <h2 className="text-lg font-bold mb-6">📅 メニュー</h2>
            <nav className="space-y-4">
              <Link href="/" className="block hover:text-yellow-300">ホーム</Link>
              <Link href="/about" className="block hover:text-yellow-300">このアプリについて</Link>
              <Link href="/settings" className="block hover:text-yellow-300">設定</Link>
            </nav>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
