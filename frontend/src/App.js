import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Reviews from './components/Reviews';
import Comic from './components/Comic';

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
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        {token && <button onClick={logout}>Logout</button>}
        <Routes>
          <Route path="/" element={token ? <Navigate to="/reviews" /> : <Login onLogin={handleLogin} />} />
          <Route path="/reviews" element={token ? <Reviews token={token} /> : <Navigate to="/" />} />
          <Route path="/comic" element={token ? <Comic token={token} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
