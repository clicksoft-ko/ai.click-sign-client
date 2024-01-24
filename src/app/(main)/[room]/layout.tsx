import React from 'react';

interface Props {
  children: React.ReactNode;
}
export default function MainLayout({ children }: Props) {
  return (
    <main className='flex h-screen flex-col items-center overflow-hidden'>
      {children}
    </main>
  );
}
