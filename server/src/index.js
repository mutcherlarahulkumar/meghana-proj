const { createApp } = require('./app');
const pool = require('./database/pool');
const port = Number(process.env.PORT || 3000);

const server = createApp().listen(port, () => {
  console.log(`Goal API listening on ${port}`);
});

// Release the database connections when the server stops.
function stop() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
