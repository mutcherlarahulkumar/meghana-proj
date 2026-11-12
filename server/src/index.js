const config = require('./config/env');
const pool = require('./database/pool');
const server = require('./app')
  .createApp()
  .listen(config.port, () => console.log(`Goal API listening on ${config.port}`));
const stop = () =>
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
