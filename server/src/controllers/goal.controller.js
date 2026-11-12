const { goalSchema } = require('../validation/goal.schema');
const idOf = (req) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    const e = new Error('Invalid goal ID');
    e.status = 400;
    throw e;
  }
  return id;
};
module.exports = (service) => ({
  list: async (req, res) => res.json({ data: await service.list() }),
  get: async (req, res) => res.json({ data: await service.get(idOf(req)) }),
  create: async (req, res) =>
    res.status(201).json({ data: await service.create(goalSchema.parse(req.body)) }),
  update: async (req, res) =>
    res.json({ data: await service.update(idOf(req), goalSchema.parse(req.body)) }),
  delete: async (req, res) => {
    await service.delete(idOf(req));
    res.status(204).end();
  },
});
