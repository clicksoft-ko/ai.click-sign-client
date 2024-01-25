import pako from 'pako';

export interface ISock {
  room: string;
  image?: ArrayBuffer;
  toWeb?: ToWeb;
  toWindow?: ToWindow;
}

export class SockModel implements ISock {
  room: string;
  image?: ArrayBuffer;
  toWeb?: ToWeb;
  toWindow?: ToWindow;

  constructor({ room, image, toWeb, toWindow }: ISock) {
    this.room = room;
    this.image = image;
    this.toWeb = toWeb;
    this.toWindow = toWindow;
  }

  get imageBuffer() {
    if (!this.image) return;
    const buffer = Buffer.from(this.image);
    return Buffer.from(buffer);
    // const buffer = Buffer.from(this.image);
    // return Buffer.from(pako.ungzip(buffer));
  }

  getObjectUrl() {
    const blob = new Blob([this.imageBuffer!], { type: 'image/webp' });
    const url = URL.createObjectURL(blob);
    return url;
  }

  dispose() {
    this.room = '';
    this.image = undefined;
    this.toWeb = undefined;
    this.toWindow = undefined;
  }
}

export enum ToWeb {
  서명요청 = 1,
  서명확인 = 2,
  서명취소 = 3,
  작성완료 = 4,
  화면공유 = 200,
  화면초기화 = 201,
}

export enum ToWindow {
  서명중 = 0,
  서명완료 = 1,
  화면공유 = 200,
  화면초기화 = 201,
}
