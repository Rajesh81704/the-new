module.exports = {
  apps: [
    {
      name: "the-new-backend",
      cwd: "/var/www/the-new/backend",
      script: "dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
