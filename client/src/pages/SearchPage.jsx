import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Check, X, Save, Download, AlertTriangle, XCircle, Camera } from 'lucide-react';
import Header from '../components/Header';
import TopSearches from '../components/TopSearches';
import UserProfile from '../components/UserProfile';

export default function SearchPage() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuery, setCurrentQuery] = useState('nature');
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // Load initial images
  useEffect(() => {
    if (currentQuery) {
      performSearch(currentQuery);
    }
  }, [currentQuery]);

  // Load current user session (if any)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/user`, { credentials: 'include' });
        if (r.ok) {
          const data = await r.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    })();
  }, []);

  const performSearch = async (term) => {
    if (!term || term.trim().length === 0) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    setSelected(new Set()); // Clear selections on new search

    try {
      const response = await fetch(`${API_BASE}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ term: term.trim() })
      });

      if (response.status === 401) {
        // Not authenticated — prompt user to login
        setError('Authentication required. Please sign in to search.');
        setImages([]);
        setLoading(false);
        setNeedsAuth(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setImages(data.results || []);
      setSearchInfo({
        term: data.term,
        total: data.total,
        source: data.source,
        warning: data.warning
      });
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentQuery(searchTerm.trim());
    }
  };

  const handleTrendingClick = (term) => {
    setSearchTerm(term);
    setCurrentQuery(term);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
      setNeedsAuth(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      setUser(null);
      navigate('/');
    }
  };

  const toggleSelect = (imageId) => {
    const newSelected = new Set(selected);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    setSelected(new Set(images.map(img => img.id)));
  };

  const downloadImage = async (image) => {
    try {
      const response = await fetch(image.url || image.thumbnail);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.title || 'image'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image. Please try right-click and "Save image as..."');
    }
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  const saveSelectedImages = async () => {
    if (selected.size === 0) {
      alert('Please select images first');
      return;
    }

    if (!user) {
      alert('Please log in to save images');
      return;
    }

    setSaveStatus('Saving...');
    
    try {
      const selectedImages = images.filter(img => selected.has(img.id));
      
      const response = await fetch(`${API_BASE}/api/saved-images/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ images: selectedImages })
      });

      if (!response.ok) throw new Error('Failed to save images');
      
      const data = await response.json();
      setSaveStatus(`✓ Saved ${data.saved} images!`);
      setTimeout(() => setSaveStatus(null), 3000);
      
      // Clear selection after saving
      setSelected(new Set());
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('Failed to save images');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div style={styles.page}>
      {/* Professional Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content Container */}
      <div style={styles.container}>
        {/* Top Searches Banner */}
        <div style={styles.bannerRow}>
          <div style={{ flex: 1 }}>
            <TopSearches onSearchClick={handleTrendingClick} />
          </div>
        </div>

        {/* Search Section */}
      <div style={styles.searchSection}>
        <h1 style={styles.title}>Image Search</h1>
        
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for images..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton} disabled={loading}>
            <Search size={18} style={{marginRight: 8}} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchInfo && (
          <div style={styles.searchInfo}>
            <span>Showing results for: <strong>{searchInfo.term}</strong></span>
            {searchInfo.total && (
              <span style={styles.totalResults}>
                ({searchInfo.total.toLocaleString()} available)
              </span>
            )}
            {searchInfo.warning && (
              <span style={styles.warning}>
                <AlertTriangle size={16} style={{marginRight: 4, verticalAlign: 'middle'}} />
                {searchInfo.warning}
              </span>
            )}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            <XCircle size={18} style={{marginRight: 6, verticalAlign: 'middle'}} />
            Error: {error}
              {needsAuth && (
                <div style={{ marginTop: 8 }}>
                  <a href={`${API_BASE}/auth/google`} style={styles.loginLink}>Sign in with Google</a>
                  &nbsp;|&nbsp;
                  <a href={`${API_BASE}/auth/github`} style={styles.loginLink}>Sign in with GitHub</a>
                  &nbsp;|&nbsp;
                  <a href={`${API_BASE}/auth/facebook`} style={styles.loginLink}>Sign in with Facebook</a>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Selection Controls */}
      {images.length > 0 && (
        <div style={styles.controls}>
          <div style={styles.selectedCounter}>
            <strong>Selected: {selected.size} images</strong>
            {selected.size > 0 && (
              <span style={styles.selectedList}>
                ({Array.from(selected).slice(0, 3).join(', ')}
                {selected.size > 3 && ` +${selected.size - 3} more`})
              </span>
            )}
            {saveStatus && <span style={styles.saveStatus}>{saveStatus}</span>}
          </div>
          <div style={styles.controlButtons}>
            <button onClick={selectAll} style={styles.controlButton}>
              <Check size={16} style={{marginRight: 6}} />
              Select All ({images.length})
            </button>
            <button onClick={clearSelection} style={styles.controlButton} disabled={selected.size === 0}>
              <X size={16} style={{marginRight: 6}} />
              Clear Selection
            </button>
            <button 
              onClick={saveSelectedImages} 
              style={{...styles.controlButton, ...styles.saveButton}} 
              disabled={selected.size === 0 || !user}
            >
              <Save size={16} style={{marginRight: 6}} />
              Save Selected ({selected.size})
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Searching for "{currentQuery}"...</p>
        </div>
      )}

      {/* Images Grid */}
      {!loading && images.length > 0 && (
        <div className="image-grid" style={styles.grid}>
          {images.map((image) => (
            <div
              key={image.id}
              className="image-card"
              style={{
                ...styles.imageCard,
                border: selected.has(image.id) ? '3px solid #667eea' : '1px solid #dee2e6'
              }}
              onClick={() => toggleSelect(image.id)}
            >
              {/* Checkbox */}
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={selected.has(image.id)}
                  onChange={() => toggleSelect(image.id)}
                  style={styles.checkbox}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Download Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(image);
                }}
                style={styles.downloadButton}
                title="Download Image"
              >
                <Download size={18} />
              </button>

              {/* Image */}
              <img
                src={image.thumbnail || image.url}
                alt={image.title}
                style={{ ...styles.image, backgroundColor: '#f6f7fb' }}
                loading="eager"
                onError={(e) => {
                  try {
                    e.currentTarget.onerror = null;
                    // Use a simple gray SVG as data URI fallback (doesn't require network)
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                  } catch (err) {
                    /* ignore */
                  }
                }}
              />

              {/* Image Info */}
              <div style={styles.imageInfo}>
                <div style={styles.imageTitle}>{image.title}</div>
                {image.author && (
                  <div style={styles.imageAuthor}>
                    <Camera size={14} style={{marginRight: 4, verticalAlign: 'middle'}} />
                    {image.author}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {/* Empty State */}
      {!loading && images.length === 0 && !error && (
        <div style={styles.emptyState}>
          <Search size={80} color="#6c757d" strokeWidth={1.5} style={{marginBottom: 16}} />
          <h2>No images found</h2>
          <p>Try searching for something else</p>
        </div>
      )}

      </div> {/* End container */}
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
  bannerRow: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
    marginBottom: 30
  },
  searchSection: {
    marginBottom: 30
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: '0 0 20px 0',
    color: '#212529'
  },
  searchForm: {
    display: 'flex',
    gap: 12,
    marginBottom: 16
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    fontSize: 16,
    border: '2px solid #dee2e6',
    borderRadius: 8,
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#667eea'
    }
  },
  searchButton: {
    padding: '12px 32px',
    fontSize: 16,
    fontWeight: 600,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 0.9
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  },
  searchInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8
  },
  totalResults: {
    color: '#495057'
  },
  warning: {
    color: '#ffc107',
    marginLeft: 'auto'
  },
  error: {
    padding: 16,
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: 8,
    color: '#721c24',
    marginBottom: 16
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: 8,
    marginBottom: 20
  },
  selectedCounter: {
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  selectedList: {
    fontSize: 13,
    color: '#6c757d'
  },
  saveStatus: {
    marginLeft: 12,
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 500,
    background: '#d4edda',
    color: '#155724',
    borderRadius: 4,
    border: '1px solid #c3e6cb'
  },
  controlButtons: {
    display: 'flex',
    gap: 8
  },
  controlButton: {
    padding: '8px 16px',
    fontSize: 14,
    background: '#fff',
    border: '1px solid #dee2e6',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      background: '#e9ecef'
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  saveButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    fontWeight: 600
  },
  loadingContainer: {
    textAlign: 'center',
    padding: 60,
    color: '#6c757d'
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20
  },
  imageCard: {
    position: 'relative',
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  checkboxContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10
  },
  checkbox: {
    width: 20,
    height: 20,
    cursor: 'pointer',
    accentColor: '#667eea'
  },
  downloadButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 36,
    height: 36,
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #dee2e6',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    ':hover': {
      background: '#667eea',
      transform: 'scale(1.1)',
      boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)'
    }
  },
  image: {
    width: '100%',
    height: 220,
    objectFit: 'cover',
    display: 'block'
  },
  imageInfo: {
    padding: 12
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#212529',
    marginBottom: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  imageAuthor: {
    fontSize: 12,
    color: '#6c757d',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  loginLink: {
    color: '#fff',
    background: '#667eea',
    padding: '6px 10px',
    borderRadius: 6,
    textDecoration: 'none',
    fontWeight: 600
  },
  emptyState: {
    textAlign: 'center',
    padding: 80,
    color: '#6c757d'
  }
};
