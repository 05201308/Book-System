const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST login
router.post('/login', async function (req, res) {
  const { membership_id, password } = req.body;

  if (!membership_id || !password) {
    return res.status(400).json({ error: 'Membership ID and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, membership_id, role FROM users WHERE membership_id = $1 AND password = $2',
      [membership_id, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Wrong membership ID or password' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Cannot reach the database. Check the backend window for the error.' });
  }
});

// GET all users (password is not sent back)
router.get('/', async function (req, res) {
  try {
    const result = await pool.query('SELECT id, name, membership_id, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Could not get users' });
  }
});

// POST add a new user
router.post('/', async function (req, res) {
  const { name, membership_id, role, password } = req.body;

  if (!name || !membership_id || !password) {
    return res.status(400).json({ error: 'Name, membership ID and password are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, membership_id, role, password) VALUES ($1, $2, $3, $4) RETURNING id, name, membership_id, role',
      [name, membership_id, role || 'member', password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'That membership ID is already used' });
    }
    res.status(500).json({ error: 'Could not add user' });
  }
});

// PUT update a user (password is only changed if a new one is sent)
router.put('/:id', async function (req, res) {
  const { name, membership_id, role, password } = req.body;

  if (!name || !membership_id) {
    return res.status(400).json({ error: 'Name and membership ID are required' });
  }

  try {
    let result;
    if (password) {
      result = await pool.query(
        'UPDATE users SET name = $1, membership_id = $2, role = $3, password = $4 WHERE id = $5 RETURNING id, name, membership_id, role',
        [name, membership_id, role, password, req.params.id]
      );
    } else {
      result = await pool.query(
        'UPDATE users SET name = $1, membership_id = $2, role = $3 WHERE id = $4 RETURNING id, name, membership_id, role',
        [name, membership_id, role, req.params.id]
      );
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'That membership ID is already used' });
    }
    res.status(500).json({ error: 'Could not update user' });
  }
});

// DELETE a user
router.delete('/:id', async function (req, res) {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Could not delete user' });
  }
});

module.exports = router;
