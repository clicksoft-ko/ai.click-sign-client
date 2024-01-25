import { useEffect, useRef } from 'react';
import useSocketReceive from './use-socket-receive';
import { Html2CanvasManager } from '@/lib/html2canvas/html2canvas-manager';
import { useSocketStore } from '../stores/use-socket-store';
import { useSocketHandler } from './use-socket-handler';

export const useRemote = () => {
  const { clearImageDataWithSign } = useSocketStore();
  const { imageSrc, signRef } = useSocketReceive();
  const { emitSharing, emitClearSharing } = useSocketHandler();
  const mainRef = useRef(null);
  const isImageEmpty = !imageSrc || !mainRef.current;

  useEffect(() => {
    let abortController: AbortController;
    let timer: NodeJS.Timeout;

    async function callTimer() {
      if (isImageEmpty) {
        emitClearSharing();
        abortController?.abort();
        return;
      }

      const canvasM = new Html2CanvasManager();
      abortController = new AbortController();
      timer = setInterval(async () => {
        const buffer = await canvasM.getBuffer(
          mainRef.current!,
          abortController.signal
        );
        await emitSharing(buffer);
      }, 1000);
    }

    callTimer().catch((error: any) => clearImageDataWithSign());

    return () => {
      abortController?.abort();
      if (timer) clearInterval(timer);
    };
  }, [clearImageDataWithSign, isImageEmpty]);

  return {
    imageSrc,
    signRef,
    mainRef,
  };
};
