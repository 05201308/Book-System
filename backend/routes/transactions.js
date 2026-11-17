const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET transaction history (newest first)
router.get('/', async function (req, res) {
  try {
    const result = await pool.query(
      'SELECT t.id, t.book_id, t.user_id, t.type, t.quantity, t.created_at, ' +
      'b.title AS book_title, u.name AS user_name ' +
      'FROM transactions t ' +
      'JOIN books b ON t.book_id = b.id ' +
      'LEFT JOIN users u ON t.user_id = u.id ' +
      'ORDER BY t.created_at DESC, t.id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Could not get transactions' });
  }
});

// POST record a transaction: type is "add" (new stock) or "borrow" (deduct stock)
router.post('/', async function (req, res) {
  const { book_id, user_id, type } = req.body;
  const quantity = parseInt(req.body.quantity);

  if (!book_id || !type || !quantity || quantity < 1) {
    return res.status(400).json({ error: 'Book, type and a quantity of at least 1 are required' });
  }
  if (type !== 'add' && type !== 'borrow') {
    return res.status(400).json({ error: 'Type must be add or borrow' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // lock the book row so two requests cannot change the stock at the same time
    const bookResult = await client.query('SELECT * FROM books WHERE id = $1 FOR UPDATE', [book_id]);
    if (bookResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = bookResult.rows[0];
    let newQuantity = book.quantity;

    if (type === 'add') {
      newQuantity = book.quantity + quantity;
    } else {
      if (book.quantity < quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Not enough copies in stock (only ' + book.quantity + ' left)' });
      }
      newQuantity = book.quantity - quantity;
    }

    await client.query('UPDATE books SET quantity = $1 WHERE id = $2', [newQuantity, book_id]);
    const inserted = await client.query(
      'INSERT INTO transactions (book_id, user_id, type, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [book_id, user_id || null, type, quantity]
    );

    await client.query('COMMIT');
    res.status(201).json(inserted.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.log(err);
    res.status(500).json({ error: 'Could not record transaction' });
  } finally {
    client.release();
  }
});

module.exports = router;
