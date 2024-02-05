'use server';

import fs from 'fs/promises';
import db from '../db';
import { imgPaths } from '@/paths';

interface SaveImageFileArgs {
  ykiho: string;
  formData: FormData;
}

export async function saveImageFile({ ykiho, formData }: SaveImageFileArgs) {
  const file = formData.get('file');
  if (file instanceof File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${ykiho}.png`;
      const path = imgPaths.remoteBg(fileName);
      const filePath = imgPaths.publicRemoteBg(fileName);

      await fs.writeFile(filePath, buffer);

      await db.remoteBg.upsert({
        create: {
          ykiho,
          bgType: 'IMAGE',
          path,
        },
        update: {
          bgType: 'IMAGE',
          path,
        },
        where: {
          ykiho,
        },
      });
    } catch (err) {
      console.log();
    }
  }
}
