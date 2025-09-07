import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/reviews.css';

export default function Reviews({ token }) {
  const [source, setSource] = useState('google');
  const [merchant, setMerchant] = useState('');
  const [place, setPlace] = useState('');
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showComic, setShowComic] = useState(false);  
  const navigate = useNavigate();

  const fetchReviews = async () => {
    const res = await axios.get(
      `/reviews?source=${source}&merchant=${merchant}&place=${place}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReviews(res.data || []);
    setShowComic(false);
  };

  const toggle = (text) => {
    setSelected((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text]
    );
  };

  // If you still want to navigate to /comic, keep goNext().
  // If you want to render the comic on the right in place of reviews,
  // set showComic = true and render there.
  const goNext = () => {
    localStorage.setItem('selectedReviews', JSON.stringify(selected.slice(0, 3)));
    localStorage.setItem('merchant', merchant);
    // navigate('/comic'); // <- old behavior
    setShowComic(true);     // <- show comic on the right instead
  };

  return (
    <div className="reviews-page">
      {/* LEFT: Fetch panel */}
      <aside className="fetch-reviews">
        <h2>Fetch Reviews</h2>

        <label className="field">
          <span>Source</span>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="google">Google</option>
            <option value="etsy">Etsy</option>
          </select>
        </label>

        <label className="field">
          <span>{source === 'etsy' ? 'Shop ID' : 'Merchant'}</span>
          <input
            placeholder={source === 'etsy' ? 'Shop ID' : 'Merchant'}
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </label>

        <label className="field">
          <span>{source === 'etsy' ? 'Unused' : 'Place'}</span>
          <input
            placeholder={source === 'etsy' ? 'Unused' : 'Place'}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
        </label>

        <button className="btn-primary" onClick={fetchReviews}>Search</button>
      </aside>

      {/* RIGHT: Reviews list OR Comic */}
      <section className="right-pane">
        {!showComic ? (
          <>
            <h3 className="pane-title">Select Reviews</h3>
            <ul className="reviews-list">
              {reviews.map((r, i) => (
                <li
                  key={i}
                  onClick={() => toggle(r.text)}
                  className={selected.includes(r.text) ? 'selected' : ''}
                >
                  <strong>{r.author_name}</strong>: {r.text}
                </li>
              ))}
            </ul>

            <div className="actions">
              {selected.length > 0 && (
                <button className="btn-accent" onClick={goNext}>
                  Generate Comic
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="comic-wrap">
            <h3 className="pane-title">Generated Comic</h3>
            {/* Replace with your real comic image or component */}
            <div className="comic-placeholder">
              Your comic appears here (replace with actual image/component).
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
