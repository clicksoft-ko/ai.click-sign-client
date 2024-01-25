import { SignConfirmProps } from '@/lib/props/sign-confirm.prop';
import { useCallback, useEffect, useRef, useState } from 'react';
import useSocketIo from './use-socket-io';
import {
  ISock,
  SockModel,
  ToWeb,
  ToWindow,
} from '../../app/classes/sock-model';
import { Html2CanvasManager } from '@/lib/html2canvas/html2canvas-manager';
import { SocketPathUtil } from '@/lib/utils/socket-path.util';
import { useSocketStore } from '../stores/use-socket-store';
import pako from 'pako';
import { useSocket } from './use-socket';
import { ImageUtil } from '../utils/image.util';

let abortController: AbortController;

export const useRemote = () => {
  const { socket, socketPath } = useSocketStore();
  const [imageData, setImageData] = useState<Buffer>();
  const [showSign, setShowSign] = useState<boolean>();
  const signRef = useRef<SignConfirmProps>(null);
  const mainRef = useRef(null);
  const isImageEmpty = !imageData || !mainRef.current;
  const imageSrc = ImageUtil.bufferToSrc(imageData);

  function clear() {
    setShowSign(false);
    return setImageData(undefined);
  }

  const handleReceive = useCallback(
    ({ toWeb, imageBuffer }: SockModel) => {
      switch (toWeb) {
        case ToWeb.서명요청:
          return setShowSign(true);
        case ToWeb.서명확인:
          return signRef?.current?.onConfirm();
        case ToWeb.서명취소:
          return setShowSign(false);
        case ToWeb.화면공유:
          return setImageData(imageBuffer);
        case ToWeb.화면초기화:
        case ToWeb.작성완료:
          clear();
      }
    },
    [setImageData]
  );

  // useSocket();
  useSocketIo({ onReceive: handleReceive });

  const emit = useCallback(
    async ({ buffer, toWindow }: { buffer?: Buffer; toWindow: ToWindow }) => {
      const compressedBuffer = buffer && pako.gzip(buffer!);
      const sock: ISock = {
        room: socketPath!.toRoom,
        image: compressedBuffer,
        toWindow: toWindow,
      };

      return await socket!.emitWithAck(SocketPathUtil.emitEv, sock);
    },
    [socketPath, socket]
  );

  const handleSignChange = useCallback(
    (buffer?: Buffer) => {
      emit({ buffer, toWindow: ToWindow.서명중 });
    },
    [emit]
  );

  const handleConfirmSign = useCallback(
    (buffer?: Buffer) => {
      setShowSign(false);
      emit({ buffer, toWindow: ToWindow.서명완료 });
    },
    [emit, setShowSign]
  );

  // useEffect(() => {
  //   const canvasM = new Html2CanvasManager();
  //   let timer: NodeJS.Timeout;
  //   async function callTimer() {
  //     if (isImageEmpty) {
  //       abortController?.abort();
  //       try {
  //         const result = await emit({ toWindow: ToWindow.화면초기화 });
  //         if (!result) clear();
  //       } catch (error: any) {
  //         console.error('Error during emit:', error.message);
  //       }
  //       return;
  //     }

  //     abortController = new AbortController();
  //     timer = setInterval(async () => {
  //       try {
  //         const buffer = await canvasM.getBuffer(
  //           mainRef.current!,
  //           abortController.signal
  //         );

  //         if (buffer) {
  //           const result = await emit({ buffer, toWindow: ToWindow.화면공유 });
  //           if (!result) clear();
  //         }
  //       } catch (error: any) {
  //         console.error('Error during getBuffer or emit:', error.message);
  //       }
  //     }, 500);
  //   }

  //   callTimer().catch((error: any) => console.log(error.message));

  //   return () => {
  //     if (timer) clearInterval(timer);
  //   };
  // }, [emit, isImageEmpty]);

  return {
    imageSrc,
    showSign,
    signRef,
    mainRef,
    handleSignChange,
    handleConfirmSign,
  };
};
