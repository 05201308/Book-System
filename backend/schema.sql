-- Run this file once to create the tables.
-- First create the database:   CREATE DATABASE library_db;
-- Then run:                     psql -U postgres -d library_db -f schema.sql

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  membership_id VARCHAR(50) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  password VARCHAR(100) NOT NULL
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  genre VARCHAR(50),
  isbn VARCHAR(30) NOT NULL UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0)
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('add', 'borrow')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Starting data so you can log in straight away
INSERT INTO users (name, membership_id, role, password) VALUES
  ('Admin User', 'ADMIN001', 'admin', 'admin123'),
  ('Precious', 'MEM001', 'member', 'member123');

INSERT INTO books (title, author, genre, isbn, quantity) VALUES
  ('Things Fall Apart', 'Chinua Achebe', 'Fiction', '9780385474542', 5),
  ('Clean Code', 'Robert C. Martin', 'Technology', '9780132350884', 1),
  ('Atomic Habits', 'James Clear', 'Self-help', '9780735211292', 3),
  ('Mine Boy', 'Peter Abrahams', 'Fiction', '9780435900298', 0);
