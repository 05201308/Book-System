import { useState } from 'react';
import { request } from '../api.js';
import Message from './Message.jsx';

// Used for both adding a new user and updating an existing one.
// If the "editUser" prop is given, the form is in update mode.
function UserForm(props) {
  const editUser = props.editUser;

  const [name, setName] = useState(editUser ? editUser.name : '');
  const [membershipId, setMembershipId] = useState(editUser ? editUser.membership_id : '');
  const [role, setRole] = useState(editUser ? editUser.role : 'member');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (name.trim() === '' || membershipId.trim() === '') {
      setError('Name and membership ID are required.');
      return;
    }
    if (!editUser && password === '') {
      setError('A password is required for a new user.');
      return;
    }

    const userData = {
      name: name.trim(),
      membership_id: membershipId.trim(),
      role: role,
      password: password
    };

    try {
      if (editUser) {
        await request('/users/' + editUser.id, 'PUT', userData);
      } else {
        await request('/users', 'POST', userData);
        setName('');
        setMembershipId('');
        setRole('member');
        setPassword('');
      }
      props.onSaved(editUser ? 'User updated.' : 'User added.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>{editUser ? 'Update user' : 'Add a new user'}</h2>
      <label>
        Name
        <input value={name} onChange={function (e) { setName(e.target.value); }} />
      </label>
      <label>
        Membership ID
        <input value={membershipId} onChange={function (e) { setMembershipId(e.target.value); }} />
      </label>
      <label>
        Role
        <select value={role} onChange={function (e) { setRole(e.target.value); }}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <label>
        {editUser ? 'New password (leave empty to keep the old one)' : 'Password'}
        <input type="password" value={password} onChange={function (e) { setPassword(e.target.value); }} />
      </label>
      <Message text={error} type="error" />
      <div className="actions">
        <button className="btn" type="submit">{editUser ? 'Save changes' : 'Add user'}</button>
        {editUser && (
          <button className="btn grey" type="button" onClick={props.onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default UserForm;
