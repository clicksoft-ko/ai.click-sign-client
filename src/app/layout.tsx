import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { fontSans } from '@/lib/fonts/font-sans';

export const metadata: Metadata = {
  title: '클릭소프트 윈도우 서명 연동',
  description: '클릭소프트 윈도우 서명 연동 웹 사이트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased',
          fontSans.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
