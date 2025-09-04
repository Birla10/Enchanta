import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ token, logout }) {
  return (
    <header className="navbar">
      <div className="logo"><Link to="/">Enchanta</Link></div>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/reviews"><span className="icon">🏠</span>Home</Link>
            <Link to="/my-comics"><span className="icon">📚</span>My Comics</Link>
            <button onClick={logout}><span className="icon">🚪</span>Logout</button>
          </>
        ) : (
          <Link to="/login"><span className="icon">🔐</span>Sign In</Link>
        )}
      </div>
    </header>
  );
}
