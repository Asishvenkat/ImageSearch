import React, { useEffect, useState } from 'react';

export default function ImageGrid({ query }) {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    
    // Call new /api/search endpoint with POST
    fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ term: query })
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setImages(data.results || []);
        if (data.warning) {
          console.warn(data.warning);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [query]);

  function toggleSelect(id) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>Error: {error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => toggleSelect(img.id)}
            style={{
              cursor: 'pointer',
              border: selected[img.id] ? '4px solid #1f6feb' : '4px solid transparent',
              borderRadius: 8,
              overflow: 'hidden'
            }}
            title={img.title}
          >
            <img src={img.thumbnail || img.url} alt={img.title} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: 8, fontSize: 13 }}>
              <div>{img.title}</div>
              {img.author && <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>by {img.author}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Selected IDs:</strong> {Object.keys(selected).filter((id) => selected[id]).join(', ') || 'None'}
      </div>
    </div>
  );
}
