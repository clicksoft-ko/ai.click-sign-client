import { useEffect, useState } from 'react';
import { SocketPathUtil } from '../utils/socket-path.util';
import {
  ISock,
  SockModel as SockData,
  SockModel,
} from '@/app/classes/sock-model';
import { useSocketStore } from '../stores/use-socket-store';

interface UseSocketIoArgs {
  onReceive: (data: SockModel) => void;
}

const useSocketIo = ({ onReceive }: UseSocketIoArgs) => {
  const { socket } = useSocketStore();
  useEffect(() => {
    const handleOrders = async (data: ISock, callback: any) => {
      await callback?.(true);
      const sock = new SockData(data);
      onReceive(sock);
    };

    socket?.on(SocketPathUtil.ev, handleOrders);
    return () => {
      socket?.off(SocketPathUtil.ev, handleOrders);
    };
  }, [onReceive, socket]);

  return { socket };
};

export default useSocketIo;
