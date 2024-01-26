export const paths = {
  remote(room?: string) {
    return '/remote' + (room ? `/${room}` : '');
  },
};
