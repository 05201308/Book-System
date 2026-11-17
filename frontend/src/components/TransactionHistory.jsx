function TransactionHistory(props) {
  const transactions = props.transactions;

  if (transactions.length === 0) {
    return <p>No transactions yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Book</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Done by</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(function (t) {
            return (
              <tr key={t.id}>
                <td>{new Date(t.created_at).toLocaleString()}</td>
                <td>{t.book_title}</td>
                <td>
                  <span className={'tag ' + t.type}>
                    {t.type === 'add' ? 'Stock added' : 'Borrowed'}
                  </span>
                </td>
                <td>{t.type === 'add' ? '+' + t.quantity : '-' + t.quantity}</td>
                <td>{t.user_name || 'Deleted user'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;
