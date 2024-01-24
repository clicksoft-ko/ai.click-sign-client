import { useEffect, useState } from 'react';
import { SocketPathUtil } from '../utils/socket-path.util';
import { SockModel as SockData } from '@/app/classes/sock-model';
import { useSocketStore } from '../stores/use-socket-store';

interface UseSocketIoArgs {
  onReceive: (data: SockData) => void;
}

const useSocketIo = ({ onReceive }: UseSocketIoArgs) => {
  const { socket } = useSocketStore();
  useEffect(() => {
    function handleOrders(data: any, callback: any): void {
      const sock = new SockData(data);
      onReceive(sock);

      callback?.(true);
    }

    socket?.on(SocketPathUtil.ev, handleOrders);

    return () => {
      socket?.off(SocketPathUtil.ev, handleOrders);
    };
  }, [socket]);

  return { socket };
};

export default useSocketIo;
