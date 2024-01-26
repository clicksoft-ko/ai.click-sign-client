export class PromiseUtil {
  static abortHandler = (reject: (reason?: any) => void) => {
    reject({
      message: 'aborted',
    });
  };

  static signalEv<T>(promise: Promise<T>, signal: AbortSignal) {
    new Promise((reslove, reject) => {
      const abortHandler = () => {
        reject('aborted');
        // 이전에 등록된 이벤트 리스너를 제거하기 위해
        signal.removeEventListener('abort', abortHandler);
      };
      signal.addEventListener('abort', abortHandler);
    });
  }
}
