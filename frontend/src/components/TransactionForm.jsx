import { useState } from 'react';
import { request } from '../api.js';
import Message from './Message.jsx';

function TransactionForm(props) {
  const [bookId, setBookId] = useState('');
  const [type, setType] = useState('add');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (bookId === '') {
      setError('Please choose a book.');
      return;
    }
    if (Number(quantity) < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    try {
      await request('/transactions', 'POST', {
        book_id: Number(bookId),
        user_id: props.user.id,
        type: type,
        quantity: Number(quantity)
      });
      setSuccess(type === 'add' ? 'Stock added.' : 'Book borrowed, stock deducted.');
      setQuantity(1);
      props.onDone();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Add or deduct stock</h2>
      <label>
        Book
        <select value={bookId} onChange={function (e) { setBookId(e.target.value); }}>
          <option value="">-- choose a book --</option>
          {props.books.map(function (book) {
            return (
              <option key={book.id} value={book.id}>
                {book.title} (stock: {book.quantity})
              </option>
            );
          })}
        </select>
      </label>
      <label>
        Transaction
        <select value={type} onChange={function (e) { setType(e.target.value); }}>
          <option value="add">Add stock (new books arrived)</option>
          <option value="borrow">Deduct stock (book borrowed)</option>
        </select>
      </label>
      <label>
        Quantity
        <input type="number" min="1" value={quantity} onChange={function (e) { setQuantity(e.target.value); }} />
      </label>
      <Message text={error} type="error" />
      <Message text={success} type="success" />
      <button className="btn" type="submit">Record transaction</button>
    </form>
  );
}

export default TransactionForm;
