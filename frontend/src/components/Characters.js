import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Characters({ token }) {
  const [characters, setCharacters] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchChars = async () => {
    const res = await axios.get('/ai/characters', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCharacters(res.data || []);
  };

  useEffect(() => {
    fetchChars();
  }, [token]);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        '/ai/character',
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCharacters((prev) => [...prev, res.data]);
      setName('');
      setDescription('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="characters-page">
      <h2>Your Characters</h2>
      <div className="character-list">
        {characters.map((c) => {
          const src = c.image.startsWith('http')
            ? c.image
            : `data:image/png;base64,${c.image}`;
          return (
            <div key={c.id} className="character-item">
              <img src={src} alt={c.name} />
              <p>{c.name}</p>
            </div>
          );
        })}
      </div>
      {characters.length < 3 && (
        <div className="create-character">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={generate} disabled={loading || !name || !description}>
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      )}
    </div>
  );
}
