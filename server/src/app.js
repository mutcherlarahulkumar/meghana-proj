const express = require('express');
const { createGoalService } = require('./services/goal.service');
function createApp(repository = require('./database/goal.repository')) {
  const app = express();
  app.use(require('helmet')());
  app.use(require('cors')({ origin: require('./config/env').origin }));
  app.use(express.json({ limit: '32kb' }));
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/goals', require('./routes/goal.routes')(createGoalService(repository)));
  app.use((req, res) => res.status(404).json({ error: { message: 'Route not found' } }));
  app.use(require('./middleware/error-handler'));
  return app;
}
module.exports = { createApp };
