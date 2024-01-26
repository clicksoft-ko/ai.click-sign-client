import { useEffect, useRef } from 'react';
import useSocketReceive from './use-socket-receive';
import { Html2CanvasManager } from '@/lib/html2canvas/html2canvas-manager';
import { useSocketStore } from '../stores/use-socket-store';
import { useSocketHandler } from './use-socket-handler';

export const useRemote = () => {
  const { clearImageDataWithSign } = useSocketStore();
  const { imageSrc, signRef } = useSocketReceive();
  const { emitPing, emitSharing, emitClearSharing } = useSocketHandler();
  const mainRef = useRef(null);
  const isImageEmpty = !imageSrc || !mainRef.current;

  useEffect(() => {
    if (isImageEmpty) return;

    const abortController = new AbortController();
    const signal = abortController.signal;
    const handleInterval = async () => {
      const success = await emitPing();
      if (signal.aborted || !success) {
        abortController.abort();
        clearImageDataWithSign();
      }
    };

    const timer = setInterval(handleInterval, 5000);

    return () => {
      abortController.abort();
      clearInterval(timer);
    };
  }, [clearImageDataWithSign, emitPing, isImageEmpty]);

  useEffect(() => {
    let abortController: AbortController;
    let timer: NodeJS.Timeout;

    async function callTimer() {
      if (isImageEmpty) {
        emitClearSharing();
        abortController?.abort();
        return;
      }

      abortController = new AbortController();

      const canvasM = new Html2CanvasManager();
      const handleInterval = async () => {
        const buffer = await canvasM.getBuffer(
          mainRef.current!,
          abortController.signal
        );
        await emitSharing(buffer);
      };

      await handleInterval();
      timer = setInterval(handleInterval, 1000);
    }

    callTimer().catch((error: any) => clearImageDataWithSign());

    return () => {
      abortController?.abort();
      if (timer) clearInterval(timer);
    };
  }, [clearImageDataWithSign, emitClearSharing, emitSharing, isImageEmpty]);

  return {
    imageSrc,
    signRef,
    mainRef,
  };
};
