import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BubbleImg from '../assets/3d_bubble.png';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    const url = isRegister ? '/register' : '/login';
    const res = await axios.post(url, { email, password });
    if (!isRegister) {
      onLogin(res.data.access_token);
      navigate('/reviews');
    } else {
      setIsRegister(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-container">
          <h2>{isRegister ? 'REGISTER' : 'LOGIN'}</h2>
          <p className="auth-tagline">Welcome to Havasa – where reviews become comics! 🎉</p>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={submit}>{isRegister ? 'Register' : 'Login'}</button>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Have an account? Login' : 'No account? Register'}
          </button>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
        <div className="auth-fun">
          <h3>Why join Havasa?</h3>
          <ul>
            <li>🎨 Turn reviews into colourful comics</li>
            <li>⚡️ Generate stories in seconds</li>
            <li>🚀 Share laughs with friends</li>
          </ul>
          <img src={BubbleImg} alt="Comic bubble" />
        </div>
      </div>
    </div>
  );
}
