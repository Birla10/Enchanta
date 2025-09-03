import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const submit = async () => {
    const url = isRegister ? '/register' : '/login';
    const res = await axios.post(url, { email, password });
    if (!isRegister) onLogin(res.data.access_token);
    else setIsRegister(false);
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>{isRegister ? 'Register' : 'Login'}</button>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Have an account? Login' : 'No account? Register'}
      </button>
    </div>
  );
}
