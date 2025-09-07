import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyComics({ token }) {
  const [comics, setComics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const resp = await axios.get('/ai/comics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComics(resp.data);
      } catch (e) {
        setComics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComics();
  }, [token]);
  if (loading) return <div className="loading-message">✨ Fetching your Comics...</div>;
  if (comics.length === 0)
    return (
      <div className="my-comics-page">
        <h2>🎨 My Comics</h2>
        <p className="my-comics-tagline">
          No comics generated yet. Start creating to fill this space! 🚀
        </p>
      </div>
    );

  const handleDownload = (src, i) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `comic-${i}.png`;
    link.click();
  };

  return (
    <div className="my-comics-page">
      <h2>🎨 My Comics</h2>
      <p className="my-comics-tagline">Click a comic to view and download it! 🎉</p>
      <div className="comic-grid">
        {comics.map((c, i) => {
          const src = c.image.startsWith('http') ? c.image : `data:image/png;base64,${c.image}`;
          return (
            <div className="comic-card" key={c.id || i} onClick={() => setSelected(src)}>
              <img src={src} alt={`comic-${i}`} style={{ width: '100%' }} />
              <button
                className="download-btn"
                onClick={e => {
                  e.stopPropagation();
                  handleDownload(src, i);
                }}
                aria-label="download"
              >
                ⬇️
              </button>
            </div>
          );
        })}
      </div>
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <img src={selected} alt="enlarged-comic" />
        </div>
      )}
    </div>
  );
}
