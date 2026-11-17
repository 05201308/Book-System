import { useState } from 'react';
import { request } from '../api.js';

// One row of the book table. It can be in normal mode or edit mode.
function BookRow(props) {
  const book = props.book;

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre || '');
  const [isbn, setIsbn] = useState(book.isbn);
  const [quantity, setQuantity] = useState(book.quantity);

  async function handleUpdate() {
    if (title.trim() === '' || author.trim() === '' || isbn.trim() === '') {
      props.onError('Title, author and ISBN are required.');
      return;
    }
    if (Number(quantity) < 0) {
      props.onError('Quantity cannot be negative.');
      return;
    }

    try {
      await request('/books/' + book.id, 'PUT', {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        isbn: isbn.trim(),
        quantity: Number(quantity)
      });
      setEditing(false);
      props.onChanged('Book updated.');
    } catch (err) {
      props.onError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete "' + book.title + '"?')) {
      return;
    }
    try {
      await request('/books/' + book.id, 'DELETE');
      props.onChanged('Book deleted.');
    } catch (err) {
      props.onError(err.message);
    }
  }

  function handleCancel() {
    // put the old values back
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre || '');
    setIsbn(book.isbn);
    setQuantity(book.quantity);
    setEditing(false);
  }

  if (editing) {
    return (
      <tr>
        <td><input value={title} onChange={function (e) { setTitle(e.target.value); }} /></td>
        <td><input value={author} onChange={function (e) { setAuthor(e.target.value); }} /></td>
        <td><input value={genre} onChange={function (e) { setGenre(e.target.value); }} /></td>
        <td><input value={isbn} onChange={function (e) { setIsbn(e.target.value); }} /></td>
        <td><input type="number" min="0" value={quantity} onChange={function (e) { setQuantity(e.target.value); }} /></td>
        <td className="actions">
          <button className="btn small" onClick={handleUpdate}>Save</button>
          <button className="btn small grey" onClick={handleCancel}>Cancel</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className={book.quantity < 2 ? 'low-stock' : ''}>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>{book.genre}</td>
      <td>{book.isbn}</td>
      <td>{book.quantity}</td>
      <td className="actions">
        <button className="btn small" onClick={function () { setEditing(true); }}>Update</button>
        <button className="btn small red" onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
}

export default BookRow;
