const mysql = require('mysql2/promise');
module.exports = mysql.createPool({ host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || 'goal_tracker', password: process.env.DB_PASSWORD, database: process.env.DB_NAME || 'goal_tracker', waitForConnections: true, connectionLimit: 10, dateStrings: true });
