import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, RefreshCw, Search, XCircle, Image } from 'lucide-react';
import Header from '../components/Header';

export default function SearchHistoryPage() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Check authentication
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch history when user is loaded
  useEffect(() => {
    if (user) {
      fetchHistory();
    } else if (user === null && !loading) {
      navigate('/login');
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/user`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        navigate('/login');
      }
    } catch (err) {
      setUser(null);
      navigate('/login');
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/search/history?limit=50`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      setHistory(data.history || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/');
    }
  };

  const handleSearchClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={handleLogout} />
      
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <button onClick={() => navigate('/search')} style={styles.backButton}>
            <ArrowLeft size={18} />
            Back to Search
          </button>
          
          <div style={styles.titleSection}>
            <h1 style={styles.title}>
              <Clock size={28} style={{marginRight: 12, verticalAlign: 'middle'}} />
              Search History
            </h1>
            <p style={styles.subtitle}>View and re-run your recent searches</p>
          </div>

          <button onClick={fetchHistory} style={styles.refreshButton} disabled={loading}>
            <RefreshCw size={18} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading your search history...</p>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            <XCircle size={20} style={{marginRight: 8}} />
            Error: {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div style={styles.emptyState}>
            <Clock size={80} color="#6c757d" strokeWidth={1.5} style={{marginBottom: 20}} />
            <h2 style={styles.emptyTitle}>No Search History Yet</h2>
            <p style={styles.emptyText}>Start searching for images to build your search history</p>
            <button onClick={() => navigate('/search')} style={styles.startButton}>
              <Search size={18} style={{marginRight: 8}} />
              Start Searching
            </button>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div style={styles.historyGrid}>
            {history.map((item, index) => (
              <div 
                key={item._id || index} 
                style={styles.historyCard}
                onClick={() => handleSearchClick(item.term)}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.searchTerm}>
                    <Search size={20} style={{marginRight: 8, flexShrink: 0}} />
                    <span style={styles.termText}>{item.term}</span>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.metaItem}>
                    <Clock size={16} style={{marginRight: 6}} />
                    <span style={styles.metaLabel}>Searched:</span>
                    <span style={styles.metaValue}>{formatDate(item.timestamp)}</span>
                  </div>

                  <div style={styles.metaItem}>
                    <Image size={16} style={{marginRight: 6}} />
                    <span style={styles.metaLabel}>Results:</span>
                    <span style={styles.metaValue}>
                      {item.resultsCount !== undefined ? item.resultsCount : 'N/A'}
                    </span>
                  </div>

                  <div style={styles.fullDate} title={formatFullDate(item.timestamp)}>
                    {formatFullDate(item.timestamp)}
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearchClick(item.term);
                    }}
                    style={styles.searchAgainButton}
                  >
                    <Search size={16} style={{marginRight: 6}} />
                    Search Again
                  </button>
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
    padding: '30px 24px',
    fontFamily: 'Inter, Arial, sans-serif'
  },
  headerSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 20,
    flexWrap: 'wrap'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    background: '#fff',
    border: '1px solid #dee2e6',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: '#495057',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  titleSection: {
    flex: 1
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#212529',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    margin: 0
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: 80,
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
  error: {
    padding: 20,
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: 12,
    color: '#721c24',
    display: 'flex',
    alignItems: 'center',
    fontSize: 15
  },
  emptyState: {
    textAlign: 'center',
    padding: 80,
    color: '#6c757d'
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#495057',
    marginBottom: 12
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 30
  },
  startButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  historyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 20
  },
  historyCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent'
  },
  cardHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: '1px solid #f1f3f5'
  },
  searchTerm: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 600,
    color: '#212529'
  },
  termText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 16
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    color: '#495057'
  },
  metaLabel: {
    fontWeight: 500,
    marginRight: 6
  },
  metaValue: {
    color: '#6c757d'
  },
  fullDate: {
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 4
  },
  cardFooter: {
    paddingTop: 16,
    borderTop: '1px solid #f1f3f5'
  },
  searchAgainButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};
