import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function RemoteLayout({ children }: Props) {
  return (
    <div className='flex h-screen items-center justify-center'>{children}</div>
  );
}
