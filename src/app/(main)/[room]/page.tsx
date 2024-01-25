'use client';

import RemoteSign from '@/components/(main)/remote-sign';
import { useRemoteSignConnect } from '@/lib/hooks/use-remote-sign-connect';
import { useSocketProvider } from '@/lib/hooks/use-socket-provider';

interface Props {
  params: {
    room: string;
  };
}

export default function MainPage({ params }: Props) {
  useSocketProvider();
  const { errorMessage } = useRemoteSignConnect(params.room);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return <RemoteSign />;
}
