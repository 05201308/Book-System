// Read-only list of books for the dashboard.
// Books with fewer than 2 copies are highlighted as low stock.
function BookList(props) {
  const books = props.books;

  if (books.length === 0) {
    return <p>No books yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>In stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {books.map(function (book) {
            const low = book.quantity < 2;
            return (
              <tr key={book.id} className={low ? 'low-stock' : ''}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>{book.quantity === 0 ? 'Out of stock' : low ? 'Low stock' : 'Available'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
