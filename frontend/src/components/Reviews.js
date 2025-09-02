import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Reviews({ token }) {
  const [merchant, setMerchant] = useState('');
  const [place, setPlace] = useState('');
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    const res = await axios.get(`/reviews?merchant=${merchant}&place=${place}`, {
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
    navigate('/comic');
  };

  return (
    <div>
      <h2>Fetch Reviews</h2>
      <input placeholder="Merchant" value={merchant} onChange={e => setMerchant(e.target.value)} />
      <input placeholder="Place" value={place} onChange={e => setPlace(e.target.value)} />
      <button onClick={fetchReviews}>Search</button>
      <ul>
        {reviews.map((r, i) => (
          <li key={i} onClick={() => toggle(r.text)} style={{ cursor: 'pointer', background: selected.includes(r.text) ? '#c8e6c9' : 'white' }}>
            <strong>{r.author_name}</strong>: {r.text}
          </li>
        ))}
      </ul>
      {selected.length > 0 && <button onClick={goNext}>Generate Comic</button>}
    </div>
  );
}
