import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Providers from '@/lib/providers/providers';
import { notoSansKR } from '@/lib/fonts/fonts';
import { unstable_noStore as noStore } from 'next/cache';

export const metadata: Metadata = {
  title: '클릭소프트 윈도우 서명 연동',
  description: '클릭소프트 윈도우 서명 연동 웹 사이트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NEXT_ENV === 'ingress') noStore();

  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          notoSansKR.className
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
