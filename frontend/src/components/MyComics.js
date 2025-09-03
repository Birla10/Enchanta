import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyComics({ token }) {
  const [comics, setComics] = useState([]);
  const [selected, setSelected] = useState(null);


  useEffect(() => {
    const fetchComics = async () => {
      const resp = await axios.get('/ai/comics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComics(resp.data);
    };
    fetchComics();
  }, [token]);

  if (comics.length === 0) return <div>No comics generated yet.</div>;

  const handleDownload = (src, i) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `comic-${i}.png`;
    link.click();
  };
  
  return (
    <div>
      <h2>My Comics</h2>
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
            <div className="comic-card" key={c.id || i}>
              <img src={src} alt={`comic-${i}`} style={{ width: '100%' }} />
            </div>
          );
        })}
      </div>
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <img src={selected} alt="enlarged-comic" />
        </div>
      )}

      {comics.map((c, i) => {
        const src = c.image.startsWith('http') ? c.image : `data:image/png;base64,${c.image}`;
        return (
          <img
            key={c.id || i}
            src={src}
            alt={`comic-${i}`}
            style={{ maxWidth: '100%', marginBottom: '10px' }}
          />
        );
      })}

    </div>
  );
}
