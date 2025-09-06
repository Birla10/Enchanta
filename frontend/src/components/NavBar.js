import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ token, logout }) {
  return (
    <div className="navbar">
      <div className="logo"><Link to="/">HAVASA</Link></div>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/reviews">Home</Link>
            <Link to="/my-comics">My Comics</Link>
            <Link onClick={logout}>Logout</Link>
          </>
        ) : (
          <Link to="/login">Sign In</Link>
        )}
      </div>
    </div>
  );
}
