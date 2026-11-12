const pool = require('./pool');
const columns = 'id, title, description, category, start_date AS startDate, end_date AS endDate, status';
module.exports = {
 async list() { const [rows] = await pool.execute(`SELECT ${columns} FROM goals ORDER BY id DESC`); return rows; },
 async find(id) { const [rows] = await pool.execute(`SELECT ${columns} FROM goals WHERE id = ?`, [id]); return rows[0]; },
 async create(g) { const [r] = await pool.execute('INSERT INTO goals (title, description, category, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)', [g.title,g.description,g.category,g.startDate,g.endDate,g.status]); return this.find(r.insertId); },
 async update(id,g) { const [r] = await pool.execute('UPDATE goals SET title=?, description=?, category=?, start_date=?, end_date=?, status=? WHERE id=?', [g.title,g.description,g.category,g.startDate,g.endDate,g.status,id]); return r.affectedRows ? this.find(id) : undefined; },
 async delete(id) { const [r] = await pool.execute('DELETE FROM goals WHERE id=?', [id]); return r.affectedRows > 0; }
};
