'use client';

import RemoteSign from '@/components/(main)/remote-sign';
import { useRemoteSignConnect } from '@/lib/hooks/use-remote-sign-connect';
import { useSocketProvider } from '@/lib/hooks/use-socket-provider';
import { MainProps } from '@/lib/props/main.props';

export default function RemoteRoomPage({ params: { room, ykiho } }: MainProps) {
  useSocketProvider();
  const { errorMessage } = useRemoteSignConnect(room!);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return <RemoteSign ykiho={ykiho} />;
}
