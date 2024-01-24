'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';

interface Props {
  error: any;
  reset: () => void;
}
export default function MainError({ error, reset }: Props) {
  return (
    <main className='flex h-full items-center justify-center'>
      <Card className='flex flex-col gap-4 p-8'>
        <h2 className='text-2xl font-bold text-red-600'>
          접속에 실패했습니다.
        </h2>
        <p className='text-base text-red-500'>{error.message}</p>
        <Button variant={'destructive'} onClick={reset}>
          재 접속 시도
        </Button>
      </Card>
    </main>
  );
}
