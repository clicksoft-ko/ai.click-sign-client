import { Loader2 } from 'lucide-react';
import React from 'react';

export default function CircleLoader() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Loader2 className='h-20 w-20 animate-spin text-green-500' />
    </div>
  );
}
