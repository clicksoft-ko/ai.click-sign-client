'use client';
import {
  ImageDragDrop,
  ImageDragRefProps,
} from '@/components/(main)/image-drag-drop';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { saveImageFile } from '@/db/server-mutate/save-remote-image';
import { useGetRemoteBg } from '@/lib/hooks/use-remote-image-to-url';
import { MainProps } from '@/lib/props/main.props';
import { BadgeInfo } from 'lucide-react';
import imageCompression, { type Options } from 'browser-image-compression';
import CircleLoader from '@/components/circle-loader';
import { removeImageFile } from '@/db/server-mutate/remove-remote-image';
import ButtonL from '@/components/ui/custom/buttonL';

export default function UpdateImagePage({ params: { ykiho } }: MainProps) {
  const {
    saveMutate,
    removeMutate,
    isMutatePending,
    isSaveSuccess,
    isRemoveSuccess,
  } = useImageMutate();
  const imageDropRef = useRef<ImageDragRefProps>(null);

  const [file, setFile] = useState<File>();
  const { url, isPending, fetchGetRemoteBg } = useGetRemoteBg({
    ykiho,
    useUrl: true,
    useDefaultUrl: false,
  });
  const isAllPending = isPending || isMutatePending;

  async function handleSave() {
    if (!file) return;

    const compressedFile = await compressImageFile(file);
    if (compressedFile) {
      const formData = new FormData();
      formData.append('file', compressedFile);
      saveMutate({ ykiho, formData });
    }
  }

  function handleRemove() {
    removeMutate({ ykiho });
  }

  useEffect(() => {
    if (!(isSaveSuccess || isRemoveSuccess)) return;

    fetchGetRemoteBg().then(() => {
      imageDropRef?.current?.clear();
    });
  }, [fetchGetRemoteBg, isSaveSuccess, isRemoveSuccess]);

  return (
    <div className='flex h-full w-full max-w-[50rem] flex-col gap-2 p-8'>
      <h2 className='flex items-center gap-2 text-xl font-bold text-blue-800'>
        <BadgeInfo className='' />
        기본 배경 이미지를 설정하세요
      </h2>
      {isPending ? (
        <CircleLoader />
      ) : (
        <ImageDragDrop
          ref={imageDropRef}
          defaultSrc={url}
          onImageChange={setFile}
        />
      )}

      <ButtonL variant={'blue'} onClick={handleSave} isLoading={isAllPending}>
        저장
      </ButtonL>
      <ButtonL
        variant={'destructive'}
        isLoading={isAllPending}
        onClick={handleRemove}
      >
        삭제
      </ButtonL>
    </div>
  );
}

async function compressImageFile(file: File) {
  const options: Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1400,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);

    return compressedFile;
  } catch (error) { }
}

const useImageMutate = () => {
  const {
    mutate: saveMutate,
    error: saveError,
    isSuccess: isSaveSuccess,
    isPending: isSavePeding,
  } = useMutation({
    mutationFn: saveImageFile,
  });

  const {
    mutate: removeMutate,
    error: removeError,
    isSuccess: isRemoveSuccess,
    isPending: isRemovePeding,
  } = useMutation({
    mutationFn: removeImageFile,
  });

  return {
    saveMutate,
    removeMutate,
    isSaveSuccess,
    isRemoveSuccess,
    isMutatePending: isSavePeding || isRemovePeding,
  };
};
