import { ISock, ToWindow } from '@/app/classes/sock-model';
import { useSocketStore } from '../stores/use-socket-store';
import { SocketPathUtil } from '../utils/socket-path.util';

export const useSocketHandler = () => {
  const { socket, socketPath, setShowSign, clearImageDataWithSign } =
    useSocketStore();

  const emit = async ({ buffer, toWindow }: EmitArgs) => {
    if (!socketPath) return;
    const sock: ISock = {
      room: socketPath.toRoom,
      image: buffer,
      toWindow: toWindow,
    };

    return await socket!.emitWithAck(SocketPathUtil.emitEv, sock);
  };

  const emitSignChange = (buffer?: Buffer) => {
    return emit({ buffer, toWindow: ToWindow.서명중 });
  };

  const emitConfirmSign = (buffer?: Buffer) => {
    setShowSign(false);
    return emit({ buffer, toWindow: ToWindow.서명완료 });
  };

  const emitSharing = async (buffer?: Buffer) => {
    if (buffer) {
      const result = await emit({ buffer, toWindow: ToWindow.화면공유 });
      if (!result) clearImageDataWithSign();
    }
  };

  const emitClearSharing = async () => {
    const result = await emit({ toWindow: ToWindow.화면초기화 });
    if (!result) clearImageDataWithSign();
  };

  return {
    emitSignChange,
    emitConfirmSign,
    emitSharing,
    emitClearSharing,
  };
};

interface EmitArgs {
  buffer?: Buffer;
  toWindow: ToWindow;
}
