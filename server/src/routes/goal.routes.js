const { Router } = require('express');
module.exports = (service) => {
  const router = Router();
  const c = require('../controllers/goal.controller')(service);
  router.route('/').get(c.list).post(c.create);
  router.route('/:id').get(c.get).put(c.update).delete(c.delete);
  return router;
};
