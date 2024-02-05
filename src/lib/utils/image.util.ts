export class ImageUtil {
  static bufferToSrc(buffer: Buffer | undefined) {
    if (!buffer) return;
    const imgBase64 = buffer.toString('base64');
    return `data:image/webp;base64,${imgBase64}`;
  }

  static base64ToObjectURL(base64: string) {
    const buffer = Buffer.from(base64, 'base64');
    const imageBlob = new Blob([buffer], { type: 'image/webp' });
    const url = URL.createObjectURL(imageBlob);
    return url;
  }
}
