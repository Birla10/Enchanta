import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/reviews.css';
import Comic from './Comic';

export default function Reviews({ token }) {
  const [source, setSource] = useState('google');
  const [merchant, setMerchant] = useState('');
  const [place, setPlace] = useState('');
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showComic, setShowComic] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [charSelected, setCharSelected] = useState([]);

  const fetchReviews = async () => {
    const res = await axios.get(
      `/reviews?source=${source}&merchant=${merchant}&place=${place}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReviews(res.data || []);
    setShowComic(false);
  };

  const fetchChars = async () => {
    const res = await axios.get('/ai/characters', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCharacters(res.data || []);
  };

  useEffect(() => {
    fetchChars();
  }, [token]);

  const toggle = (text) => {
    setSelected((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text]
    );
  };

  const toggleChar = (id) => {
    setCharSelected((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const goNext = () => {
    localStorage.setItem('selectedReviews', JSON.stringify(selected.slice(0, 3)));
    localStorage.setItem('merchant', merchant);
    localStorage.setItem('selectedCharacters', JSON.stringify(charSelected.slice(0, 3)));
    setShowComic(true);
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

      {/* RIGHT: reviews list or generated comic */}
      <section className="right-pane">
        {showComic ? (
          <div className="comic-wrap">
            <h3 className="pane-title">Generated Comic</h3>
            <Comic token={token} />
          </div>
        ) : reviews.length > 0 ? (
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

            {characters.length > 0 && (
              <>
                <h3 className="pane-title">Select Characters (max 3)</h3>
                <div className="characters-select">
                  {characters.map((c) => {
                    const src = c.image.startsWith('http')
                      ? c.image
                      : `data:image/png;base64,${c.image}`;
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleChar(c.id)}
                        className={
                          charSelected.includes(c.id) ? 'char selected' : 'char'
                        }
                      >
                        <img src={src} alt={c.name} />
                        <p>{c.name}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="actions">
              {selected.length > 0 && (
                <button className="btn-accent" onClick={goNext}>
                  Generate Comic
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="placeholder">
            <div className="placeholder-animation">Your reviews will appear here</div>
          </div>
        )}
      </section>
    </div>
  );
}
