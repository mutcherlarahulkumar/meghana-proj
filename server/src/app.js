const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const goalRoutes = require('./goals');

// Tests supply a fake database; the running app uses the MySQL goal queries.
function createApp(goals = require('./database/goal.repository')) {
  const app = express();
  app.use(helmet());
  const config = require('./config');
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/goals', goalRoutes(goals));
  app.use((req, res) => res.status(404).json({ error: { message: 'Route not found' } }));

  // One place for validation errors and unexpected database errors.
  app.use((error, req, res, next) => {
    if (error.name === 'ZodError')
      return res.status(400).json({
        error: { message: 'Please check the goal fields', details: error.flatten() },
      });
    const status = error.status || 500;
    if (status >= 500) console.error('API error:', error.code || error.message);
    res.status(status).json({
      error: {
        message: status >= 500 ? 'Unable to access goals. Please try again later.' : error.message,
      },
    });
  });

  return app;
}

module.exports = { createApp };
