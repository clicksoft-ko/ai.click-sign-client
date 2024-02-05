'use server';
import { imgPaths } from '@/paths';
import fs from 'fs';
import db from '../db';

interface RemoveImageFileArgs {
  ykiho: string;
}

export async function removeImageFile({ ykiho }: RemoveImageFileArgs) {
  const fileName = `${ykiho}.png`;
  const filePath = imgPaths.publicRemoteBg(fileName);

  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.rm(filePath);
    }

    await db.remoteBg.delete({
      where: { ykiho },
    });
  } catch (err) {
    console.log(err);
  }
}
