// PM2 process definition for the Atsumi Labs marketing site.
// Behind nginx, proxy atsumilabs.com -> 127.0.0.1:PORT.
//
//   pm2 start ecosystem.config.cjs       # first time
//   pm2 reload ecosystem.config.cjs      # zero-downtime reload (used by CI)
module.exports = {
  apps: [
    {
      name: "atsumilabs",
      script: "server.js",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_memory_restart: "150M",
      env: {
        NODE_ENV: "production",
        // 8080 + 8123 (tadkaplay) are taken; this site uses 8124.
        PORT: 8124,
      },
    },
  ],
};
