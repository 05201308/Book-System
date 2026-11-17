// Runs when the server starts. It creates the database and the tables
// if they do not exist yet, and adds the starting data the first time.
const { Client } = require('pg');
const pool = require('./db');
const config = pool.config;

async function createDatabaseIfMissing() {
  // connect to the default "postgres" database just to create ours
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres'
  });
  await client.connect();

  const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [config.database]);
  if (result.rows.length === 0) {
    await client.query('CREATE DATABASE ' + config.database);
    console.log('Created database ' + config.database);
  }
  await client.end();
}

async function createTables() {
  await pool.query(
    'CREATE TABLE IF NOT EXISTS users (' +
    'id SERIAL PRIMARY KEY, ' +
    'name VARCHAR(100) NOT NULL, ' +
    'membership_id VARCHAR(50) NOT NULL UNIQUE, ' +
    "role VARCHAR(20) NOT NULL DEFAULT 'member', " +
    'password VARCHAR(100) NOT NULL)'
  );

  await pool.query(
    'CREATE TABLE IF NOT EXISTS books (' +
    'id SERIAL PRIMARY KEY, ' +
    'title VARCHAR(200) NOT NULL, ' +
    'author VARCHAR(100) NOT NULL, ' +
    'genre VARCHAR(50), ' +
    'isbn VARCHAR(30) NOT NULL UNIQUE, ' +
    'quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0))'
  );

  await pool.query(
    'CREATE TABLE IF NOT EXISTS transactions (' +
    'id SERIAL PRIMARY KEY, ' +
    'book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE, ' +
    'user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, ' +
    "type VARCHAR(10) NOT NULL CHECK (type IN ('add', 'borrow')), " +
    'quantity INTEGER NOT NULL CHECK (quantity > 0), ' +
    'created_at TIMESTAMP NOT NULL DEFAULT NOW())'
  );
}

async function addStartingData() {
  const users = await pool.query('SELECT COUNT(*) FROM users');
  if (Number(users.rows[0].count) === 0) {
    await pool.query(
      "INSERT INTO users (name, membership_id, role, password) VALUES " +
      "('Admin User', 'ADMIN001', 'admin', 'admin123'), " +
      "('Precious', 'MEM001', 'member', 'member123')"
    );
    console.log('Added starting users (ADMIN001 / MEM001)');
  }

  const books = await pool.query('SELECT COUNT(*) FROM books');
  if (Number(books.rows[0].count) === 0) {
    await pool.query(
      "INSERT INTO books (title, author, genre, isbn, quantity) VALUES " +
      "('Things Fall Apart', 'Chinua Achebe', 'Fiction', '9780385474542', 5), " +
      "('Clean Code', 'Robert C. Martin', 'Technology', '9780132350884', 1), " +
      "('Atomic Habits', 'James Clear', 'Self-help', '9780735211292', 3), " +
      "('Mine Boy', 'Peter Abrahams', 'Fiction', '9780435900298', 0)"
    );
    console.log('Added starting books');
  }
}

async function setupDatabase() {
  await createDatabaseIfMissing();
  await createTables();
  await addStartingData();
}

module.exports = setupDatabase;
