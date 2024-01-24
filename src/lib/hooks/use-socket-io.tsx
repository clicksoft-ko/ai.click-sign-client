import { useCallback, useEffect, useState } from 'react';
import { SocketPathUtil } from '../utils/socket-path.util';
import { SockModel as SockData } from '@/app/classes/sock-model';
import { useSocketStore } from '../stores/use-socket-store';

interface UseSocketIoArgs {
  onReceive: (data: SockData) => void;
}

const useSocketIo = ({ onReceive }: UseSocketIoArgs) => {
  const { socket } = useSocketStore();
  const handleOrders = useCallback(
    (data: any, callback: any) => {
      const sock = new SockData(data);
      callback?.(true);
      onReceive(sock);
    },
    [onReceive]
  );

  useEffect(() => {
    socket?.on(SocketPathUtil.ev, handleOrders);
    return () => {
      socket?.off(SocketPathUtil.ev, handleOrders);
    };
  }, [socket, handleOrders]);

  return { socket };
};

export default useSocketIo;
