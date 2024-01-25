import { socket } from '@/socket';
import { useEffect, useState } from 'react';
import { SocketPathUtil } from '../utils/socket-path.util';
import { ISock } from '@/app/classes/sock-model';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any>();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    async function handleOrders(data: ISock, callback: any) {
      await callback?.(true);

      setFooEvents(data);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(SocketPathUtil.ev, handleOrders);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(SocketPathUtil.ev, handleOrders);
    };
  }, []);
};
