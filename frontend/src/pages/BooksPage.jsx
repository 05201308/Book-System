import { useState, useEffect } from 'react';
import { request } from '../api.js';
import AddBookForm from '../components/AddBookForm.jsx';
import BookRow from '../components/BookRow.jsx';
import Message from '../components/Message.jsx';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function loadBooks() {
    request('/books')
      .then(function (data) { setBooks(data); })
      .catch(function (err) { setError(err.message); });
  }

  useEffect(function () {
    loadBooks();
  }, []);

  function handleChanged(text) {
    setError('');
    setSuccess(text);
    loadBooks();
  }

  function handleError(text) {
    setSuccess('');
    setError(text);
  }

  return (
    <div>
      <h2>Book Management</h2>
      <AddBookForm onAdded={function () { handleChanged('Book added.'); }} />

      <h3>All books</h3>
      <Message text={error} type="error" />
      <Message text={success} type="success" />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(function (book) {
              return (
                <BookRow
                  key={book.id + '-' + book.title + book.quantity + book.isbn}
                  book={book}
                  onChanged={handleChanged}
                  onError={handleError}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {books.length === 0 && <p>No books yet. Add one above.</p>}
    </div>
  );
}

export default BooksPage;
