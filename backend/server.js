const express = require('express');
const cors = require('cors');

const setupDatabase = require('./setup');
const booksRoutes = require('./routes/books');
const transactionsRoutes = require('./routes/transactions');
const usersRoutes = require('./routes/users');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/books', booksRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/users', usersRoutes);

app.get('/', function (req, res) {
  res.send('Library API is running');
});

// Prints a clear message for the most common database problems
function explainError(err) {
  console.log('');
  console.log('=== COULD NOT SET UP THE DATABASE ===');
  if (err.code === '28P01' || (err.message && err.message.indexOf('password') !== -1)) {
    console.log('Wrong PostgreSQL password.');
    console.log('Open backend/db.js and type your PostgreSQL password on the "password" line.');
  } else if (err.code === 'ECONNREFUSED') {
    console.log('PostgreSQL is not running (or is on a different port).');
    console.log('Start the PostgreSQL service, then run npm start again.');
  } else if (err.code === '28000') {
    console.log('That PostgreSQL user does not exist. Check the "user" line in backend/db.js.');
  } else {
    console.log(err.message);
  }
  console.log('');
}

const PORT = process.env.PORT || 5000;

setupDatabase()
  .then(function () {
    app.listen(PORT, function () {
      console.log('Database ready.');
      console.log('Server running on http://localhost:' + PORT);
    });
  })
  .catch(function (err) {
    explainError(err);
    process.exit(1);
  });
