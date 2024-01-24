import { SignConfirmProps } from '@/lib/props/sign-confirm.prop';
import { useEffect, useRef, useState } from 'react';
import useSocketIo from './use-socket-io';
import { ISock, ToWeb, ToWindow } from '../../app/classes/sock-model';
import { Html2CanvasManager } from '@/lib/html2canvas/html2canvas-manager';
import { SocketPathUtil } from '@/lib/utils/socket-path.util';
import { useSocketStore } from '../stores/use-socket-store';

let abortController: AbortController;

export const useRemote = () => {
  const { socket, socketPath } = useSocketStore();
  const [imageData, setImageData] = useState<string>();
  const [showSign, setShowSign] = useState<boolean>();
  const signRef = useRef<SignConfirmProps>(null);
  const mainRef = useRef(null);
  const isImageEmpty = !imageData || !mainRef.current;

  function clear() {
    setShowSign(false);
    return setImageData(undefined);
  }

  useSocketIo({
    onReceive: ({ toWeb, imageData }) => {
      switch (toWeb) {
        case ToWeb.서명요청:
          return setShowSign(true);
        case ToWeb.서명확인:
          return signRef?.current?.onConfirm();
        case ToWeb.서명취소:
          return setShowSign(false);
        case ToWeb.화면공유:
          return setImageData(imageData);
        case ToWeb.화면초기화:
        case ToWeb.작성완료:
          clear();
      }
    },
  });

  async function emit({
    buffer,
    toWindow,
  }: {
    buffer?: Buffer;
    toWindow: ToWindow;
  }) {
    const sock: ISock = {
      room: socketPath!.toRoom,
      image: buffer,
      toWindow: toWindow,
    };

    return await socket!.emitWithAck(SocketPathUtil.emitEv, sock);
  }

  function handleSignChange(buffer?: Buffer): void {
    emit({ buffer, toWindow: ToWindow.서명중 });
  }

  function handleConfirmSign(buffer?: Buffer): void {
    setShowSign(false);
    emit({ buffer, toWindow: ToWindow.서명완료 });
  }

  useEffect(() => {
    const canvasM = new Html2CanvasManager();
    let timer: NodeJS.Timeout;
    async function callTimer() {
      if (isImageEmpty) {
        abortController?.abort();
        const result = await emit({ toWindow: ToWindow.화면초기화 });
        if (!result) clear();
        return;
      }

      abortController = new AbortController();
      timer = setInterval(async () => {
        const buffer = await canvasM.getBuffer(
          mainRef.current!,
          abortController.signal
        );

        if (buffer) {
          const result = await emit({ buffer, toWindow: ToWindow.화면공유 });
          if (!result) clear();
        }
      }, 500);
    }

    callTimer().catch((error: any) => console.log(error.message));

    return () => {
      clearInterval(timer);
    };
  }, [isImageEmpty]);

  return {
    imageData,
    showSign,
    signRef,
    mainRef,
    handleSignChange,
    handleConfirmSign,
  };
};
