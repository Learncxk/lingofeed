import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LingoFeed — TikTok for Words',
  description: 'Swipe through words like a social feed. Learn IELTS vocabulary with reading, quiz & spell cards.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-dvh bg-slate-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
