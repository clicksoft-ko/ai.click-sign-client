export const paths = {
  remote(room?: string) {
    return '/remote' + (room ? `/${room}` : '');
  },
};

export const imgPaths = {
  remoteBgBase: '/images/remote-bg/base.png',
  remoteBg: (fileName: string) => {
    return `/images/remote-bg/${fileName}`;
  },
  publicRemoteBg: (fileName: string) => {
    return `public${imgPaths.remoteBg(fileName)}`;
  },
};
