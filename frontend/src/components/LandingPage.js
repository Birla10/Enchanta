import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage({ token }) {
  const navigate = useNavigate();
  const go = () => {
    if (token) navigate('/reviews');
    else navigate('/login');
  };

  return (
    <div className="landing-page">
      <div className="hero-text">
        <h1>Grow Your Business with Effective Marketing</h1>
        <p>Reach your target audience and drive sales with our innovative marketing solutions.</p>
        <button onClick={go}>Get Started</button>
      </div>
      <div className="hero-art">
        <img src="/assets/target-character.svg" alt="target" className="hero-target" />
        <img src="/assets/jump-character.svg" alt="jump" className="hero-jump" />
        <img src="/assets/coin-character.svg" alt="coin" className="hero-coin" />
      </div>
    </div>
  );
}
