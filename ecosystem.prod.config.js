module.exports = {
  apps: [
    {
      name: 'click-sign-client',
      exec_mode: 'cluster',
      instances: '2',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env_prod: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
  ],
};
