// Connects to PostgreSQL.
// >>> If your PostgreSQL has a password, type it between the quotes on the password line. <<<
const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',   // <-- put your PostgreSQL password here
  database: process.env.DB_NAME || 'library_db'
};

const pool = new Pool(config);

module.exports = pool;
module.exports.config = config;
