import React, { useRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSocketStore } from '@/lib/stores/use-socket-store';
import { SocketPathUtil } from '@/lib/utils/socket-path.util';

export default function RemoteSignIn() {
  const { socket, setSocketPath } = useSocketStore();
  const roomRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const room = roomRef.current?.value;
    if (!room) return;

    const socketPath = new SocketPathUtil(room);
    socket!
      .timeout(10000)
      .emitWithAck('roomIn', socketPath.roomIn)
      .then((res) => {
        if (res.errorMessage) throw new Error(res.errorMessage);
        setSocketPath(socketPath);
      })
      .catch(() => {
        setSocketPath(undefined);
      });
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
