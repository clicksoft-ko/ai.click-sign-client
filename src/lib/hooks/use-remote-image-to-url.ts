import {
  GetRemoteBgResult,
  getRemoteBg,
  getRemoteBgImageBase64,
} from '@/db/server-query/get-remote-image';
import { useCallback, useEffect, useState } from 'react';
import { ImageUtil } from '../utils/image.util';
import { imgPaths } from '@/paths';

interface Args {
  ykiho: string;
  useUrl?: Boolean;
  useDefaultUrl?: Boolean;
}

export const useGetRemoteBg = ({
  ykiho,
  useUrl,
  useDefaultUrl = true,
}: Args) => {
  const [remoteBg, setRemoteBg] = useState<GetRemoteBgResult | null>(null);
  const [url, setUrl] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  const fetchGetRemoteBg = useCallback(async () => {
    try {
      setIsPending(true);
      if (useUrl) {
        const base64string = await getRemoteBgImageBase64({ ykiho });

        if (base64string) {
          const url = ImageUtil.base64ToObjectURL(base64string);
          setUrl(url);
        } else {
          setUrl(useDefaultUrl ? imgPaths.remoteBgBase : undefined);
        }
      }

      const remoteBg = await getRemoteBg({ ykiho });
      setRemoteBg(remoteBg);
    } catch (ex) {
      console.log(ex);
    } finally {
      setIsPending(false);
    }
  }, []);

  const clearUrl = () => {
    setUrl(undefined);
  };

  useEffect(() => {
    fetchGetRemoteBg();
  }, [fetchGetRemoteBg, useUrl, ykiho]);

  useEffect(() => {
    if (!useUrl) return;

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url, useUrl]);

  return {
    remoteBg: <GetRemoteBgResult>(remoteBg || {}),
    url: url,
    isPending,
    clearUrl,
    fetchGetRemoteBg,
  };
};
