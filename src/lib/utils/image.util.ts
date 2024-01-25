export class ImageUtil {
  static bufferToSrc(buffer: Buffer | undefined) {
    if (!buffer) return;
    const imgBase64 = buffer.toString('base64');
    return `data:image/webp;base64,${imgBase64}`;
  }
}
