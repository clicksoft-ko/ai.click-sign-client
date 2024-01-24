import { useRemote } from '@/lib/hooks/use-remote';
import React from 'react';
import Image from 'next/image';
import { SignCanvas } from '../sign-canvas';
import { useSocketStore } from '@/lib/stores/use-socket-store';

export default function RemoteSign() {
  const { socketPath } = useSocketStore();
  const {
    imageData,
    showSign,
    signRef,
    mainRef,
    handleSignChange,
    handleConfirmSign,
  } = useRemote();

  if (!socketPath) return <></>;

  return (
    <div className='h-full w-full overflow-hidden' ref={mainRef}>
      {imageData ? (
        <div className='m-4'>
          <Image
            src={imageData!}
            alt='폼 이미지'
            width={1000}
            height={1000}
            className='h-full w-full object-cover'
          />
        </div>
      ) : (
        <Image
          className='h-full w-full object-contain'
          src={'/images/background.jpg'}
          width={4000}
          height={4000}
          alt='스크린 보호'
        />
      )}

      {showSign && (
        <SignCanvas
          ref={signRef}
          onSignChanged={handleSignChange}
          onConfirm={handleConfirmSign}
        />
      )}
    </div>
  );
}
