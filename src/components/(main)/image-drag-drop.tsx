'use client';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';

interface Props {
  onImageChange: (file: File | undefined) => void;
  defaultSrc: string | undefined;
}

export interface ImageDragRefProps {
  clear: () => void;
}

const ImageDragDrop = React.forwardRef<ImageDragRefProps, Props>(
  ({ defaultSrc, onImageChange }: Props, ref) => {
    const [file, setFile] = useState<File>();
    const [src, setSrc] = useState<string>();
    const [isHover, setIsHover] = useState(false);
    const dropRef = useRef<HTMLLabelElement>(null);
    const currentSrc = src || defaultSrc;

    useImperativeHandle(ref, () => ({
      clear: () => {
        setFile(undefined);
      },
    }));

    function handleDragEnter(e: React.DragEvent<HTMLLabelElement>): void {
      setIsHover(true);
    }

    function handleDragLeave(e: React.DragEvent<HTMLLabelElement>): void {
      e.preventDefault();
      const relEl = e.relatedTarget as HTMLElement;

      if (!dropRef?.current?.contains(relEl)) {
        setIsHover(false);
      }
    }

    function handleDragOver(e: React.DragEvent<HTMLLabelElement>): void {
      e.preventDefault();
    }

    function setFirstImageFile(files: FileList | null) {
      const file = files?.[0];
      const isImage = file?.type.startsWith('image/');
      if (!isImage) {
        setFile(undefined);
        return;
      }

      setFile(file);
    }

    function handleDrop(e: React.DragEvent<HTMLLabelElement>): void {
      e.preventDefault();
      setIsHover(false);
      setFirstImageFile(e.dataTransfer.files);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
      if ((e.target.files?.length ?? 0) === 0) return;
      setFirstImageFile(e.target.files);
    }

    useEffect(() => {
      onImageChange(file);
      if (!file) {
        setSrc(undefined);
        return;
      }

      const src = URL.createObjectURL(file);
      setSrc(src);
    }, [file]);

    useEffect(() => {
      return () => {
        URL.revokeObjectURL(src!);
      };
    }, [src]);

    return (
      <label
        ref={dropRef}
        className={cn(
          'flex h-full items-center justify-center overflow-hidden border-2 border-slate-300',
          isHover ? 'border-dotted border-blue-500 bg-blue-200 opacity-70' : ''
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleInputChange}
        />
        {!currentSrc && <DropInformaiton />}
        {currentSrc && (
          <Image
            className='h-full w-full object-contain'
            width={1000}
            height={800}
            src={currentSrc}
            alt='이미지'
          />
        )}
      </label>
    );
  }
);

ImageDragDrop.displayName = 'ImageDragDrop';

function DropInformaiton() {
  return (
    <div className='absolute flex flex-col items-center gap-1'>
      <Download className='mb-4 h-16 w-16 text-orange-600' />
      <div className='text-gray-800'>클릭 혹은 이미지를 드래그드롭하세요.</div>
      <div className='text-sm text-gray-500'>이미지 파일만 가능해요 ^^</div>
    </div>
  );
}

export { ImageDragDrop };
