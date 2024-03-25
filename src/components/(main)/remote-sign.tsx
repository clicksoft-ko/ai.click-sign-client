import { useRemote } from '@/lib/hooks/use-remote';
import React from 'react';
import Image from 'next/image';
import { SignCanvas } from '../sign-canvas';
import { useSocketStore } from '@/lib/stores/use-socket-store';
import { useGetRemoteBg } from '@/lib/hooks/use-remote-image-to-url';
import { Loader2 } from 'lucide-react';
import CircleLoader from '../circle-loader';

interface Props {
  ykiho: string;
}
export default function RemoteSign({ ykiho }: Props) {
  const { showSign } = useSocketStore();
  const { imageSrc, signRef, mainRef } = useRemote();
  const { url, isPending } = useGetRemoteBg({ ykiho, useUrl: true });

  let component;
  if (isPending) {
    component = <CircleLoader />;
  } else if (imageSrc) {
    component = <RemoteScreen imageSrc={imageSrc} />;
  } else if (url) {
    component = <BackgroundScreen url={url} />;
  } else {
    // component = <></>;
  }

  return (
    <div
      className='h-full w-full overflow-hidden'
      ref={mainRef}
      onContextMenu={(e) => e.preventDefault()}
    >
      {component}
      {showSign && <SignCanvas ref={signRef} />}
    </div>
  );
}

function RemoteScreen({ imageSrc }: { imageSrc: string }) {
  return (
    <div className='m-4'>
      <Image
        src={imageSrc}
        alt='폼 이미지'
        width={1000}
        height={1000}
        className='h-full w-full object-cover'
      />
    </div>
  );
}

function BackgroundScreen({ url }: { url: string }) {
  return (
    <Image
      className='h-full w-full object-contain'
      src={url}
      width={800}
      height={1400}
      alt='배경 이미지'
    />
  );
}
