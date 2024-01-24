import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSocketStore } from '../stores/use-socket-store';

export const useSocketProvider = () => {
  const { setSocket, setConnected } = useSocketStore();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      transports: ['websocket'],
    });
    setSocket(socket);

    function handleConnect() {
      setConnected(true);
    }

    function handleDisconnect() {
      setConnected(false);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      setSocket(null);
    };
  }, [setConnected, setSocket]);
};
