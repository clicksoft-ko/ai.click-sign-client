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

interface Props extends SignConfirmProps {
  signRef?: React.RefObject<ReactSignatureCanvas>;
  onSignChanged: (buffer?: Buffer) => void;
}

const SignCanvas = React.forwardRef<SignConfirmProps, Props>(
  ({ onConfirm, onSignChanged }: Props, ref) => {
    const signRef = useRef<ReactSignatureCanvas>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    function handleRewrite(): void {
      signRef?.current?.clear();
      onSignChanged(undefined);
    }

    const getSignBuffer = useCallback(() => {
      if (!signRef.current) {
        return;
      }
      const dataURL = signRef.current.toDataURL();
      const buffer = Buffer.from(dataURL.split(',')[1], 'base64');
      return buffer;
    }, []);

    const handleSignChange = useCallback(() => {
      const buffer = getSignBuffer();
      onSignChanged(buffer);
    }, [getSignBuffer, onSignChanged]);

    const handleConfirm = useCallback(() => {
      const buffer = getSignBuffer();
      onConfirm(buffer);
    }, [getSignBuffer, onConfirm]);

    useImperativeHandle(
      ref,
      () => {
        return { onConfirm: handleConfirm };
      },
      [handleConfirm]
    );

    // useEffect(() => {
    //   if (!isDrawing) return;
    //   const timer = setInterval(() => {
    //     handleSignChange();
    //   }, 50);
    //   return () => {
    //     clearInterval(timer);
    //   };
    // }, [handleSignChange, isDrawing]);

    return (
      <div className='fixed bottom-1 left-1/2 mb-2 flex -translate-x-1/2 flex-col gap-1 rounded border border-solid border-blue-400 bg-blue-50 p-1 shadow-lg'>
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
          onBegin={() => setIsDrawing(true)}
          onEnd={() => {
            setIsDrawing(false);
            setTimeout(handleSignChange, 100);
          }}
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
