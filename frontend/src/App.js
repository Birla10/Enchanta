import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Login from './components/Login';
import Reviews from './components/Reviews';
import Comic from './components/Comic';
import MyComics from './components/MyComics';
import NavBar from './components/NavBar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const handleLogin = (tok) => {
    localStorage.setItem('token', tok);
    setToken(tok);
  };
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    if (!token) return;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
      }, 5 * 60 * 1000);
    };
    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [token]);

  return (
    <Router>
      {token && <NavBar logout={logout} />}
      <div className="container">
        <div style={{ padding: '20px' }}>
        {token && (
          <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <Link to="/reviews">Home</Link>
            <Link to="/my-comics">My Comics</Link>
            <button onClick={logout}>Logout</button>
          </nav>
        )}
        <Routes>
          <Route path="/" element={token ? <Navigate to="/reviews" /> : <Login onLogin={handleLogin} />} />
          <Route path="/reviews" element={token ? <Reviews token={token} /> : <Navigate to="/" />} />
          <Route path="/comic" element={token ? <Comic token={token} /> : <Navigate to="/" />} />
          <Route path="/my-comics" element={token ? <MyComics token={token} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
