'use client';
import { SignCanvas } from '@/components/sign-canvas';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Image from 'next/image';

export default function MainPage() {
  const [visibleImage, setVisibleImage] = useState(false);
  return (
    <div>
      <Button onClick={() => setVisibleImage((prev) => !prev)}>
        이미지 토글
      </Button>
      {visibleImage && <Image src='/images/bigimage.bmp' alt='..' width={4000} height={4000} />}
      <SignCanvas onSignChanged={() => { }} onConfirm={() => { }} />
    </div>
  );
}
