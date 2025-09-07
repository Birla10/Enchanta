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
  const navigate = useNavigate();

  const fetchReviews = async () => {
    const res = await axios.get(`/reviews?source=${source}&merchant=${merchant}&place=${place}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews(res.data);
  };

  const toggle = (text) => {
    setSelected(prev =>
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
    );
  };

  const goNext = () => {
    localStorage.setItem('selectedReviews', JSON.stringify(selected.slice(0, 3)));
    localStorage.setItem('merchant', merchant);
    navigate('/comic');
  };

  return (
    <div className='fetch-reviews'>
      <h2>Fetch Reviews</h2>
      <select value={source} onChange={e => setSource(e.target.value)}>
        <option value="google">Google</option>
        <option value="etsy">Etsy</option>
      </select>
      <input
        placeholder={source === 'etsy' ? 'Shop ID' : 'Merchant'}
        value={merchant}
        onChange={e => setMerchant(e.target.value)}
      />
      <input
        placeholder={source === 'etsy' ? 'Unused' : 'Place'}
        value={place}
        onChange={e => setPlace(e.target.value)}
      />
      <button onClick={fetchReviews}>Search</button>
      <ul className="reviews-list">
        {reviews.map((r, i) => (
          <li
            key={i}
            onClick={() => toggle(r.text)}
            className={selected.includes(r.text) ? 'selected' : ''}
            style={{ cursor: 'pointer' }}
          >
            <strong>{r.author_name}</strong>: {r.text}
          </li>
        ))}
      </ul>
      {selected.length > 0 && <button onClick={goNext}>Generate Comic</button>}
    </div>
  );
}
