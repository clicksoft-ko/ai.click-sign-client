import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';
import { SocketPathUtil } from '../utils/socket-path.util';

interface State {
  socket: Socket | null;
  connected: boolean;
  socketPath?: SocketPathUtil;
  showSign: boolean;
  imageData?: Buffer;
}

interface Action {
  setSocket: (socket: Socket | null) => void;
  setConnected: (connected: boolean) => void;
  setSocketPath: (socketPath?: SocketPathUtil) => void;
  setShowSign: (showSign: boolean) => void;
  setImageData: (imageData?: Buffer) => void;
  clearImageDataWithSign: () => void;
}

const initialState: State = {
  socket: null,
  connected: false,
  socketPath: undefined,
  showSign: false,
  imageData: undefined,
};

export const useSocketStore = create<State & Action>((set) => ({
  ...initialState,
  setSocket: (socket) => set(() => ({ socket })),
  setConnected: (connected) => set(() => ({ connected })),
  setSocketPath: (socketPath) => set(() => ({ socketPath })),
  setShowSign: (showSign) => set(() => ({ showSign })),
  setImageData: (imageData) => set(() => ({ imageData })),
  clearImageDataWithSign: () =>
    set(() => ({ imageData: undefined, showSign: false })),
}));
