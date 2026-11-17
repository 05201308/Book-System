import { useState, useEffect } from 'react';
import { request } from '../api.js';
import BookList from '../components/BookList.jsx';
import Message from '../components/Message.jsx';

function DashboardPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  // runs once when the page opens
  useEffect(function () {
    request('/books')
      .then(function (data) { setBooks(data); })
      .catch(function (err) { setError(err.message); });
  }, []);

  let totalCopies = 0;
  let lowStockCount = 0;
  for (let i = 0; i < books.length; i++) {
    totalCopies = totalCopies + books[i].quantity;
    if (books[i].quantity < 2) {
      lowStockCount = lowStockCount + 1;
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <Message text={error} type="error" />

      <div className="stats">
        <div className="card stat"><span>{books.length}</span>Book titles</div>
        <div className="card stat"><span>{totalCopies}</span>Copies in stock</div>
        <div className="card stat warn"><span>{lowStockCount}</span>Low stock (under 2)</div>
      </div>

      <h3>Book availability</h3>
      <BookList books={books} />
    </div>
  );
}

export default DashboardPage;
