/**
 * PM2 ecosystem configuration for production deployment
 * Install PM2: npm install -g pm2
 * Start: pm2 start ecosystem.config.js
 * Monitor: pm2 monit
 * Logs: pm2 logs
 */

module.exports = {
  apps: [
    {
      name: 'pargos-chest-api',
      script: './dist/index.js',
      instances: process.env.PM2_INSTANCES || 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      instance_var: 'INSTANCE_ID',
      min_uptime: '10s',
      max_restarts: 10,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
