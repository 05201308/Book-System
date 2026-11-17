const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all books
router.get('/', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Could not get books' });
  }
});

// POST add a new book
router.post('/', async function (req, res) {
  const { title, author, genre, isbn, quantity } = req.body;

  if (!title || !author || !isbn) {
    return res.status(400).json({ error: 'Title, author and ISBN are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, genre, isbn, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, author, genre, isbn, quantity || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A book with that ISBN already exists' });
    }
    res.status(500).json({ error: 'Could not add book' });
  }
});

// PUT update a book
router.put('/:id', async function (req, res) {
  const { title, author, genre, isbn, quantity } = req.body;

  if (!title || !author || !isbn) {
    return res.status(400).json({ error: 'Title, author and ISBN are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, genre = $3, isbn = $4, quantity = $5 WHERE id = $6 RETURNING *',
      [title, author, genre, isbn, quantity, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A book with that ISBN already exists' });
    }
    res.status(500).json({ error: 'Could not update book' });
  }
});

// DELETE a book
router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Could not delete book' });
  }
});

module.exports = router;
