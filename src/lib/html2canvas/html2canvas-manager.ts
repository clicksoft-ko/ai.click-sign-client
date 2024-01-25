import html2canvas from 'html2canvas';

export class Html2CanvasManager {
  prevDataUrl: string = '';
  constructor() { }

  async getCanvas(element: HTMLElement, signal: AbortSignal) {
    return await Promise.race([
      html2canvas(element, { scale: 0.3 }),
      new Promise<object>((_, reject) => {
        const abortHandler = () => reject('aborted');
        signal.addEventListener('abort', abortHandler);
        return () => {
          return signal.removeEventListener('abort', abortHandler);
        };
      }),
    ]);
  }

  async getBuffer(element: HTMLElement, signal: AbortSignal) {
    try {
      const canvas = await this.getCanvas(element, signal);

      if (!(canvas instanceof HTMLCanvasElement)) return;

      const dataUrl = canvas.toDataURL('image/png');
      if (this.prevDataUrl === dataUrl) return;
      this.prevDataUrl = dataUrl;
      // PNG 데이터 URL을 Buffer로 변환
      const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');
      return buffer;
    } catch (err) {
      return undefined;
    }
  }
}
