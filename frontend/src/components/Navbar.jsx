import { NavLink } from 'react-router-dom';

function Navbar(props) {
  const user = props.user;

  return (
    <nav className="navbar">
      <h1 className="logo">📚 Community Library</h1>
      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/users">{user ? 'Users' : 'Login'}</NavLink>
      </div>
      {user && (
        <div className="nav-user">
          <span>{user.name} ({user.role})</span>
          <button className="btn small" onClick={props.onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
