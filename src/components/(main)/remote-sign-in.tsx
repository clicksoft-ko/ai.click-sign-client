'use client';
import React, { useRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

export default function RemoteSignIn() {
  const { push } = useRouter();
  const roomRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const room = roomRef.current?.value;
    if (!room) return;

    push(paths.remote(room));
  }

  return (
    <div className='flex h-full items-center justify-center'>
      <div className='flex flex-col p-4 shadow'>
        <h2 className='mb-2 text-xl font-bold text-blue-500'>
          서명 연동 서비스
        </h2>
        <form className='flex flex-col gap-1' onSubmit={handleSubmit}>
          <label>
            코드
            <Input ref={roomRef} />
          </label>
          <Button variant={'blue'}>접속하기</Button>
        </form>
      </div>
    </div>
  );
}
