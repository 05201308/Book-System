import { useState, useEffect } from 'react';
import { request } from '../api.js';
import LoginForm from '../components/LoginForm.jsx';
import UserForm from '../components/UserForm.jsx';
import UserList from '../components/UserList.jsx';
import Message from '../components/Message.jsx';

function UsersPage(props) {
  const user = props.user;

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function loadUsers() {
    request('/users')
      .then(function (data) { setUsers(data); })
      .catch(function (err) { setError(err.message); });
  }

  // only the admin needs the list of users
  useEffect(function () {
    if (user && user.role === 'admin') {
      loadUsers();
    }
  }, [user]);

  function handleSaved(text) {
    setError('');
    setSuccess(text);
    setEditUser(null);
    loadUsers();
  }

  async function handleDelete(u) {
    if (u.id === user.id) {
      setSuccess('');
      setError('You cannot delete the account you are logged in with.');
      return;
    }
    if (!window.confirm('Delete user ' + u.name + '?')) {
      return;
    }
    try {
      await request('/users/' + u.id, 'DELETE');
      setError('');
      setSuccess('User deleted.');
      loadUsers();
    } catch (err) {
      setSuccess('');
      setError(err.message);
    }
  }

  // not logged in: show the login form
  if (!user) {
    return (
      <div>
        <h2>User Management</h2>
        <p>Please log in to use the library system.</p>
        <LoginForm onLogin={props.onLogin} />
      </div>
    );
  }

  // logged in as a normal member
  if (user.role !== 'admin') {
    return (
      <div>
        <h2>User Management</h2>
        <div className="card">
          <p>Logged in as <strong>{user.name}</strong> (ID: {user.membership_id}).</p>
          <p>Only admins can add, update or delete users.</p>
        </div>
      </div>
    );
  }

  // logged in as admin
  return (
    <div>
      <h2>User Management (Admin)</h2>

      {/* key makes the form reset when we switch between users */}
      <UserForm
        key={editUser ? editUser.id : 'new'}
        editUser={editUser}
        onSaved={handleSaved}
        onCancel={function () { setEditUser(null); }}
      />

      <h3>All users</h3>
      <Message text={error} type="error" />
      <Message text={success} type="success" />
      <UserList users={users} onEdit={setEditUser} onDelete={handleDelete} />
    </div>
  );
}

export default UsersPage;
