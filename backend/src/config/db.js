const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'face_hospital',
  connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
  waitForConnections: true,
  queueLimit: 0,
});

async function checkDatabaseConnection() {
  const connection = await pool.getConnection();
  connection.release();
}

module.exports = {
  pool,
  checkDatabaseConnection,
};
