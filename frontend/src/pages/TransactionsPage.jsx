import { useState, useEffect } from 'react';
import { request } from '../api.js';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionHistory from '../components/TransactionHistory.jsx';
import Message from '../components/Message.jsx';

function TransactionsPage(props) {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  // loads both the books (for the dropdown and stock numbers) and the history
  function loadData() {
    request('/books')
      .then(function (data) { setBooks(data); })
      .catch(function (err) { setError(err.message); });

    request('/transactions')
      .then(function (data) { setTransactions(data); })
      .catch(function (err) { setError(err.message); });
  }

  useEffect(function () {
    loadData();
  }, []);

  return (
    <div>
      <h2>Transactions</h2>
      <Message text={error} type="error" />
      <TransactionForm books={books} user={props.user} onDone={loadData} />

      <h3>Transaction history</h3>
      <TransactionHistory transactions={transactions} />
    </div>
  );
}

export default TransactionsPage;
