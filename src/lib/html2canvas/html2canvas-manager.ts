import html2canvas from 'html2canvas';

export class Html2CanvasManager {
  constructor() { }

  private fetchData(canvas: HTMLCanvasElement, signal: AbortSignal) {
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob && !signal.aborted) {
          return resolve(blob);
        } else {
          return reject(undefined);
        }
      });
    });
  }

  async getBuffer(element: HTMLElement, signal: AbortSignal) {
    try {
      const canvas = await html2canvas(element, { scale: 0.25 });
      const promiseBlob = await this.fetchData(
        canvas,
        signal
      );
      const blob = await promiseBlob;
      const arrayBuffer = await blob?.arrayBuffer();
      if (arrayBuffer) {
        return Buffer.from(arrayBuffer);
      }
    } catch {
      return undefined;
    }
  }
}
