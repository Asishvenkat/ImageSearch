import React, { useState, useEffect } from 'react';

export default function SavedImages({ onImageClick }) {
  const [savedImages, setSavedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    fetchSavedImages();
  }, []);

  const fetchSavedImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/saved-images`, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        setSavedImages([]);
        setError(null);
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch saved images');
      
      const data = await response.json();
      setSavedImages(data.images || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSavedImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(`${API_BASE}/api/saved-images/${imageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setSavedImages(savedImages.filter(img => img._id !== imageId));
      }
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading saved images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>⚠️ {error}</div>
      </div>
    );
  }

  if (savedImages.length === 0) {
    return null; // Don't show if no saved images
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>💾 Saved Images ({savedImages.length})</h3>
        <button onClick={fetchSavedImages} style={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>
      <div style={styles.grid}>
        {savedImages.map((image) => (
          <div key={image._id} style={styles.imageCard}>
            <img
              src={image.thumbnail || image.url}
              alt={image.title}
              style={styles.image}
              onClick={() => onImageClick && onImageClick(image)}
            />
            <div style={styles.imageInfo}>
              <div style={styles.imageTitle}>{image.title}</div>
              <button
                onClick={() => handleDelete(image._id)}
                style={styles.deleteButton}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#1f2937'
  },
  refreshButton: {
    padding: '6px 14px',
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: 12
  },
  imageCard: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    display: 'block'
  },
  imageInfo: {
    padding: 8,
    background: '#f9fafb'
  },
  imageTitle: {
    fontSize: 12,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 6,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  deleteButton: {
    width: '100%',
    padding: '4px 8px',
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 500,
    transition: 'all 0.2s ease'
  },
  loading: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280'
  },
  error: {
    textAlign: 'center',
    padding: 20,
    color: '#dc2626',
    fontSize: 13
  }
};
