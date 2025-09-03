import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ logout }) {
  return (
    <header className="navbar">
      <div className="logo">Enchanta</div>
      <div className="nav-links">
        <Link to="/reviews"><span className="icon">🏠</span>Home</Link>
        <Link to="/my-comics"><span className="icon">📚</span>My Comics</Link>
        <button onClick={logout}><span className="icon">🚪</span>Logout</button>
      </div>
    </header>
  );
}
