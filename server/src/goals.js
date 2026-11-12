const { Router } = require('express');
const { z } = require('zod');
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
  .refine((v) => {
    const d = new Date(v);
    return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0, 10) === v;
  }, 'Invalid calendar date');
const goalSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(5000).default(''),
    category: z.string().trim().min(1).max(60),
    startDate: date,
    endDate: date,
    status: z.enum(['pending', 'in_progress', 'completed']),
  })
  .strict()
  .refine((g) => g.endDate >= g.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

// Check the URL parameter before using it in a query.
function goalId(req) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    const error = new Error('Invalid goal ID');
    error.status = 400;
    throw error;
  }
  return id;
}

// Express 5 sends errors from async routes to the app's error handler.
function goalRoutes(goals) {
  const router = Router();

  router.get('/', async (req, res) => {
    res.json({ data: await goals.list() });
  });

  router.get('/:id', async (req, res) => {
    const goal = await goals.find(goalId(req));
    if (!goal) return res.status(404).json({ error: { message: 'Goal not found' } });
    res.json({ data: goal });
  });

  router.post('/', async (req, res) => {
    const input = goalSchema.parse(req.body);
    const goal = await goals.create(input);
    res.status(201).json({ data: goal });
  });

  router.put('/:id', async (req, res) => {
    const id = goalId(req);
    const input = goalSchema.parse(req.body);
    const goal = await goals.update(id, input);
    if (!goal) return res.status(404).json({ error: { message: 'Goal not found' } });
    res.json({ data: goal });
  });

  router.delete('/:id', async (req, res) => {
    const deleted = await goals.delete(goalId(req));
    if (!deleted) return res.status(404).json({ error: { message: 'Goal not found' } });
    res.status(204).end();
  });

  return router;
}

module.exports = goalRoutes;
