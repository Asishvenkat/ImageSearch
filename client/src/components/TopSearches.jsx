import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';

export default function TopSearches({ onSearchClick }) {
  const [topSearches, setTopSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopSearches();
  }, []);

  const fetchTopSearches = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/top-searches?limit=5')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then(data => {
        setTopSearches(data.topSearches || []);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.error('Failed to fetch top searches:', err);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>
          <TrendingUp size={20} style={{marginRight: 8, verticalAlign: 'middle'}} />
          Trending Searches
        </h3>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>
          <TrendingUp size={20} style={{marginRight: 8, verticalAlign: 'middle'}} />
          Trending Searches
        </h3>
        <div style={styles.error}>Unable to load trending searches</div>
      </div>
    );
  }

  if (topSearches.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>
          <TrendingUp size={20} style={{marginRight: 8, verticalAlign: 'middle'}} />
          Trending Searches
        </h3>
        <div style={styles.empty}>No searches yet. Be the first!</div>
      </div>
    );
  }

  const handleClick = (term) => {
    if (onSearchClick) {
      onSearchClick(term);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <TrendingUp size={20} style={{marginRight: 8, verticalAlign: 'middle'}} />
          Trending Searches
        </h3>
        <button onClick={fetchTopSearches} style={styles.refreshButton}>
          <RefreshCw size={16} style={{marginRight: 6}} />
          Refresh
        </button>
      </div>
      <div style={styles.list}>
        {topSearches.map((item, index) => (
          <div
            key={item.term}
            style={styles.item}
            onClick={() => handleClick(item.term)}
          >
            <div style={styles.rank}>#{index + 1}</div>
            <div style={styles.content}>
              <div style={styles.term}>{item.term}</div>
              <div style={styles.meta}>
                <span style={styles.badge}>
                  {item.count} {item.count === 1 ? 'search' : 'searches'}
                </span>
                <span style={styles.users}>
                  👥 {item.userCount}
                </span>
              </div>
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
    padding: '16px 20px',
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
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#1f2937'
  },
  list: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBottom: 4,
    scrollbarWidth: 'thin',
    scrollbarColor: '#cbd5e1 #f1f5f9'
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid #e5e7eb',
    minWidth: 140,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
      borderColor: '#667eea'
    }
  },
  rank: {
    position: 'absolute',
    top: 6,
    left: 6,
    fontSize: 12,
    fontWeight: 700,
    color: '#667eea',
    background: '#eef2ff',
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    textAlign: 'center',
    width: '100%',
    marginTop: 20
  },
  term: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 8,
    color: '#1f2937',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    fontSize: 11
  },
  badge: {
    background: '#667eea',
    color: '#fff',
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  users: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: 500
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
  },
  empty: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: 13
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
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 4
  }
};
