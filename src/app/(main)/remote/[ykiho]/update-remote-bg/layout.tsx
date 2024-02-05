import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-full w-full justify-center bg-slate-50'>
      {children}
    </div>
  );
}
