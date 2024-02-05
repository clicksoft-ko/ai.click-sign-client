'use server';

import { $Enums } from '@/prisma/client';
import db from '../db';
import path from 'path';
import fs from 'fs';

interface Args {
  ykiho: string;
}

export interface GetRemoteBgResult {
  bgType: $Enums.BgTypeEnum;
  path: string;
}

export async function getRemoteBg({
  ykiho,
}: Args): Promise<GetRemoteBgResult | null> {
  const result = await db.remoteBg.findFirst({
    select: { bgType: true, path: true },
    where: { ykiho },
  });

  return result;
}

export async function getRemoteBgImageBase64({ ykiho }: Args) {
  const result = await db.remoteBg.findFirst({
    select: { bgType: true, path: true },
    where: { ykiho },
  });

  if (result?.path) {
    const imagePath = path.resolve(process.cwd(), `public${result.path}`);
    if (fs.existsSync(imagePath))
      return await fs.promises.readFile(imagePath, 'base64');
  }

  return;
}
