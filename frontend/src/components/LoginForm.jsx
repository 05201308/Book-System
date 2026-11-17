import { useState } from 'react';
import { request } from '../api.js';
import Message from './Message.jsx';

function LoginForm(props) {
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (membershipId.trim() === '' || password === '') {
      setError('Please enter your membership ID and password.');
      return;
    }

    try {
      const user = await request('/users/login', 'POST', {
        membership_id: membershipId.trim(),
        password: password
      });
      props.onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card form-grid login-card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        Membership ID
        <input value={membershipId} onChange={function (e) { setMembershipId(e.target.value); }} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={function (e) { setPassword(e.target.value); }} />
      </label>
      <Message text={error} type="error" />
      <button className="btn" type="submit">Login</button>
      <p className="hint">Try: ADMIN001 / admin123 (admin) or MEM001 / member123 (member)</p>
    </form>
  );
}

export default LoginForm;
