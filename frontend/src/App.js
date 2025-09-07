import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Reviews from './components/Reviews';
import Comic from './components/Comic';
import MyComics from './components/MyComics';
import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';

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
    let timer = null;
    const reset = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000);
    };
    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [token]);

  return (
    <Router>
      <NavBar token={token} logout={logout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<LandingPage token={token} />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/reviews" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/reviews"
            element={token ? <Reviews token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/comic"
            element={token ? <Comic token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-comics"
            element={token ? <MyComics token={token} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
