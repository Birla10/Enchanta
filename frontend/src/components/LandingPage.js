import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import ReviewImg from '../assets/3d_review.png';
import BubbleImg from '../assets/3d_bubble.png';
import NewArrival from '../assets/3d_na.png';
import Enchanta from '../assets/ENCHANTA.png';

export default function LandingPage({ token }) {
  const navigate = useNavigate();
  const go = () => {
    if (token) navigate('/reviews');
    else navigate('/login');
  };

  return (
    <div>
      <div className="landing-page">
        <section className="hero">
          <h1>Turn customer reviews & sales data <br /> into scroll-stopping visuals</h1>
          <p>
            Havasa transforms text and numbers into on-brand content, <br /> carousels, and
            stories that boost clicks, saves, and shares.
          </p>
          <div className="cta-buttons">
            <button className="start-btn" onClick={go}>Start Free</button>
            <button className="examples-btn">See Examples</button>
          </div>
        </section>
        <section className="features">
          <div className="feature-card">
            <h3>Connect</h3>
            <p>Plug in your reviews & sales sources (Google, Yelp, Shopify).</p>
            <img src={ReviewImg} alt="Reviews" style={{ width: '85%', height: '35%', marginTop: '1.5rem' }} /> 
          </div>
          <div className="feature-card">
            <h3>Generate</h3>
            <p>Pick a vibe; Havasa creates mini cartoons, carousels, and scripts.</p>
            <img src={BubbleImg} alt="Bubble" style={{ width: '90%', height: '40%', marginTop: '1rem' }}/>
          </div>
          <div className="feature-card">
            <h3>Publish</h3>
            <p>One-click export to Instagram, Reels, and web.</p>
            <img src={NewArrival} alt="New Arrival" style={{ width: '90%', height: '40%', marginTop: '1rem' }}/>
          </div>
        </section>
      </div>
      <br /><br />
      <div className="fun-section">
        <div className="fun-content">
          <h2>Why you'll love Havasa</h2>
          <ul>
            <li>🎉 Turn boring data into colorful comics</li>
            <li>🤖 Let AI craft stories for you</li>
            <li>🌈 Share laughs with friends and fans</li>
          </ul>
        </div>
        <div className="fun-image">
          <img src={Enchanta} alt="Fun Illustration" />
        </div>
      </div>
    </div>
  );
}
