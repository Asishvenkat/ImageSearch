import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Save, Trash2, Download, Camera, Search, Inbox, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';

export default function SavedImagesPage() {
  const navigate = useNavigate();
  const [savedImages, setSavedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  // Load current user session
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/user`, { credentials: 'include' });
        if (r.ok) {
          const data = await r.json();
          setUser(data.user);
        } else {
          setUser(null);
          navigate('/login'); // Redirect to login if not authenticated
        }
      } catch (err) {
        setUser(null);
        navigate('/login');
      }
    })();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedImages();
    }
  }, [user]);

  const fetchSavedImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/saved-images`, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        navigate('/login');
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
    if (!confirm('Are you sure you want to remove this image?')) return;

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
      alert('Failed to delete image');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore
    }
    setUser(null);
    navigate('/');
  };

  const downloadImage = (url, title) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={handleLogout} />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <Save size={28} style={{marginRight: 12, verticalAlign: 'middle'}} />
              Saved Images
            </h1>
            <p style={styles.subtitle}>
              {savedImages.length} {savedImages.length === 1 ? 'image' : 'images'} saved
            </p>
          </div>
          <div style={styles.actions}>
            <button onClick={fetchSavedImages} style={styles.refreshButton}>
              <RefreshCw size={16} style={{marginRight: 6}} />
              Refresh
            </button>
            <button onClick={() => navigate('/search')} style={styles.backButton}>
              <ArrowLeft size={16} style={{marginRight: 6}} />
              Back to Search
            </button>
          </div>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading saved images...</p>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            <AlertTriangle size={18} style={{marginRight: 8, verticalAlign: 'middle'}} />
            {error}
          </div>
        )}

        {!loading && !error && savedImages.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Inbox size={80} color="#ccc" />
            </div>
            <h2>No saved images yet</h2>
            <p>Start searching and save your favorite images!</p>
            <button onClick={() => navigate('/search')} style={styles.searchButton}>
              <Search size={18} style={{marginRight: 8}} />
              Start Searching
            </button>
          </div>
        )}

        {!loading && savedImages.length > 0 && (
          <div style={styles.grid}>
            {savedImages.map((image) => (
              <div key={image._id} style={styles.imageCard}>
                <div style={styles.imageWrapper}>
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.title}
                    style={styles.image}
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div style={styles.overlay}>
                    <button
                      onClick={() => downloadImage(image.url, image.title)}
                      style={styles.actionButton}
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      style={{...styles.actionButton, ...styles.deleteActionButton}}
                      title="Remove"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div style={styles.imageInfo}>
                  <div style={styles.imageTitle}>{image.title}</div>
                  {image.author && (
                    <div style={styles.imageAuthor}>
                      <Camera size={14} style={{marginRight: 4, verticalAlign: 'middle'}} />
                      {image.author}
                    </div>
                  )}
                  <div style={styles.imageMeta}>
                    Saved {new Date(image.savedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: 20,
    fontFamily: 'Inter, Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2px solid #e5e7eb'
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: '0 0 8px 0',
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    margin: 0
  },
  actions: {
    display: 'flex',
    gap: 12
  },
  refreshButton: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  backButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.2s ease'
  },
  searchButton: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    marginTop: 20,
    transition: 'all 0.2s ease'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24
  },
  imageCard: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    }
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6'
  },
  image: {
    width: '100%',
    height: 250,
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.3s ease'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#fff',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteActionButton: {
    background: '#fee2e2',
    color: '#dc2626'
  },
  imageInfo: {
    padding: 16
  },
  imageTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 6,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  imageAuthor: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4
  },
  imageMeta: {
    fontSize: 12,
    color: '#9ca3af'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: 60,
    color: '#6b7280'
  },
  spinner: {
    width: 50,
    height: 50,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  error: {
    padding: 20,
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    color: '#dc2626',
    textAlign: 'center'
  },
  emptyState: {
    textAlign: 'center',
    padding: 80,
    color: '#6b7280'
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20
  }
};
