import { SignConfirmProps } from '@/lib/props/sign-confirm.prop';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReactSignatureCanvas from 'react-signature-canvas';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/button';
import { useSocketHandler } from '@/lib/hooks/use-socket-handler';

interface Props { }

const SignCanvas = React.forwardRef<SignConfirmProps, Props>(
  ({ }: Props, ref) => {
    const { emitSignChange, emitConfirmSign } = useSocketHandler();
    const signRef = useRef<ReactSignatureCanvas>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    function handleRewrite(): void {
      signRef?.current?.clear();
      emitSignChange(undefined);
    }

    const getSignBuffer = useCallback(() => {
      if (!signRef.current) return;

      const dataURL = signRef.current.toDataURL();
      const buffer = Buffer.from(dataURL.split(',')[1], 'base64');
      return buffer;
    }, []);

    const handleConfirm = useCallback(() => {
      const buffer = getSignBuffer();
      emitConfirmSign(buffer);
    }, [emitConfirmSign, getSignBuffer]);

    const handleSignChange = useCallback(() => {
      const buffer = getSignBuffer();
      emitSignChange(buffer);
    }, [emitSignChange, getSignBuffer]);

    function handleBeginSign() {
      setIsDrawing(true);
    }

    function handleEndSign() {
      setIsDrawing(false);
      setTimeout(handleSignChange, 200);
    }

    useImperativeHandle(
      ref,
      () => {
        return { onConfirm: handleConfirm };
      },
      [handleConfirm]
    );

    useEffect(() => {
      if (!isDrawing) return;

      const timer = setInterval(() => {
        handleSignChange();
      }, 200);
      return () => clearInterval(timer);
    }, [handleSignChange, isDrawing]);

    return (
      <div className='fixed bottom-32 left-1/2 mb-2 flex -translate-x-1/2 flex-col gap-1 rounded border border-solid border-blue-400 bg-blue-50 p-1 shadow-lg'>
        <div className='flex items-center justify-between'>
          <span className='p-2 text-lg font-bold text-blue-800'>
            서명해주세요.
          </span>
          <div className='flex h-full space-x-1'>
            <Button
              className='w-24'
              onClick={handleRewrite}
              variant={'destructive'}
            >
              다시 작성
            </Button>
            <Button className='w-24' onClick={handleConfirm} variant={'blue'}>
              확인
            </Button>
          </div>
        </div>
        <SignatureCanvas
          minWidth={3}
          maxWidth={5}
          minDistance={1}
          onBegin={handleBeginSign}
          onEnd={handleEndSign}
          ref={signRef}
          penColor='black'
          canvasProps={{
            width: 400,
            height: 200,
            className: 'bg-white border border-solid border-slate-200',
          }}
        />
      </div>
    );
  }
);

SignCanvas.displayName = 'SignCanvas';
export { SignCanvas };
