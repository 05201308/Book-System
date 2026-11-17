import { useState } from 'react';
import { request } from '../api.js';
import Message from './Message.jsx';

function AddBookForm(props) {
  // one state value for each input (controlled inputs)
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // validation
    if (title.trim() === '' || author.trim() === '' || isbn.trim() === '') {
      setError('Title, author and ISBN are required.');
      return;
    }
    if (Number(quantity) < 0) {
      setError('Quantity cannot be negative.');
      return;
    }

    try {
      await request('/books', 'POST', {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        isbn: isbn.trim(),
        quantity: Number(quantity)
      });
      // clear the form and tell the page to reload the list
      setTitle('');
      setAuthor('');
      setGenre('');
      setIsbn('');
      setQuantity(1);
      props.onAdded();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Add a new book</h2>
      <label>
        Title
        <input value={title} onChange={function (e) { setTitle(e.target.value); }} />
      </label>
      <label>
        Author
        <input value={author} onChange={function (e) { setAuthor(e.target.value); }} />
      </label>
      <label>
        Genre
        <input value={genre} onChange={function (e) { setGenre(e.target.value); }} />
      </label>
      <label>
        ISBN
        <input value={isbn} onChange={function (e) { setIsbn(e.target.value); }} />
      </label>
      <label>
        Initial quantity
        <input type="number" min="0" value={quantity} onChange={function (e) { setQuantity(e.target.value); }} />
      </label>
      <Message text={error} type="error" />
      <button className="btn" type="submit">Add book</button>
    </form>
  );
}

export default AddBookForm;
