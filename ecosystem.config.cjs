module.exports = {
  apps: [
    {
      name: 'web-nuxt4-template',
      exec_mode: 'cluster',
      instances: '2',
      script: './server/index.mjs',
      cwd: '.output',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
      env_dev: {
        PORT: 7707,
        NODE_ENV: 'development',
      },
    },
  ],
};
