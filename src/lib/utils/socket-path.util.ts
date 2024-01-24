export class SocketPathUtil {
  constructor(private key: string) { }
  get roomIn() {
    return `web-${this.key}`;
  }

  get toRoom() {
    return `window-${this.key}`;
  }

  static get ev() {
    return 'toWeb';
  }

  static get emitEv() {
    return 'fromWeb';
  }
}
