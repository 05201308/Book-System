import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';

function App() {
  // The logged in user is kept in state and also saved in localStorage
  // so the login is still there after a page refresh.
  const [user, setUser] = useState(function () {
    const saved = localStorage.getItem('libraryUser');
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  });

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    localStorage.setItem('libraryUser', JSON.stringify(loggedInUser));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('libraryUser');
  }

  // Pages that need a login send the visitor to the login page
  function protect(page) {
    if (user) {
      return page;
    }
    return <Navigate to="/users" />;
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container">
        <Routes>
          <Route path="/" element={protect(<DashboardPage />)} />
          <Route path="/books" element={protect(<BooksPage />)} />
          <Route path="/transactions" element={protect(<TransactionsPage user={user} />)} />
          <Route path="/users" element={<UsersPage user={user} onLogin={handleLogin} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
