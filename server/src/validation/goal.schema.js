const { z } = require('zod');
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').refine(v => { const d = new Date(v); return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0,10) === v; }, 'Invalid calendar date');
const goalSchema = z.object({ title: z.string().trim().min(1).max(120), description: z.string().trim().max(5000).default(''), category: z.string().trim().min(1).max(60), startDate: date, endDate: date, status: z.enum(['pending','in_progress','completed']) }).strict().refine(g => g.endDate >= g.startDate, { message: 'End date must be on or after start date', path: ['endDate'] });
module.exports = { goalSchema };
