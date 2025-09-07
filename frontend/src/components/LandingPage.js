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
      <section className="hero">
        <h1>Turn customer reviews & sales data into scroll-stopping visuals</h1>
        <p>
          Havasa transforms text and numbers into on-brand content, carousels, and
          stories that boost clicks, saves, and shares.
        </p>
        <div className="cta-buttons">
          <button className="start-btn" onClick={go}>Start Free</button>
          <button className="examples-btn">See Examples</button>
        </div>
      </section>
      <section className="features">
        <div className="feature">
          <h3>Connect</h3>
          <p>Plug in your reviews & sales sources (Google, Yelp, Shopify).</p>
        </div>
        <div className="feature">
          <h3>Generate</h3>
          <p>Pick a vibe; Havasa creates mini cartoons, carousels, and scripts.</p>
        </div>
        <div className="feature">
          <h3>Publish</h3>
          <p>One-click export to Instagram, Reels, and web.</p>
        </div>
      </section>
    </div>
  );
}
