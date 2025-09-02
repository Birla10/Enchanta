import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Comic({ token }) {
  const [conversation, setConversation] = useState('');
  const [image, setImage] = useState(null);
  const reviews = JSON.parse(localStorage.getItem('selectedReviews') || '[]');

  useEffect(() => {
    const generate = async () => {
      const conv = await axios.post('/ai/conversation', { reviews }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversation(conv.data.conversation);
      const img = await axios.post('/ai/comic', { conversation: conv.data.conversation }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImage(img.data.image);
    };
    generate();
  }, [token]);

  const download = () => {
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${image}`;
    a.download = 'comic.png';
    a.click();
  };

  if (!image) return <div>Generating comic...</div>;

  return (
    <div>
      <h2>Comic Strip</h2>
      <img src={`data:image/png;base64,${image}`} alt="comic" style={{ maxWidth: '100%' }} />
      <p><em>Prompt sent: Create a 3d comic strip with the following conversation...</em></p>
      <button onClick={download}>Download</button>
    </div>
  );
}
