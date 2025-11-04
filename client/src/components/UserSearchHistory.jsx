import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function UserSearchHistory({ onSearchClick, user }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-fetch history when user is logged in
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = () => {
    setLoading(true);
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

    fetch(`${API_BASE}/api/search/history?limit=10`, {
      credentials: 'include'
    })
      .then(r => {
        if (!r.ok) {
          if (r.status === 401) throw new Error('Not logged in');
          throw new Error('Failed to fetch history');
        }
        return r.json();
      })
      .then(data => {
        setHistory(data.history || []);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
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

  // Don't show anything if not logged in
  if (!user) {
    return null;
  }

  // Don't show full list - only show "View All History" button
  if (history.length === 0 && !loading && !error) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  // Show compact "View All History" button instead of full list
  return (
    <div className="user-search-history" style={styles.container}>
      <div style={styles.compactHeader}>
        <div style={styles.compactTitle}>
          <Clock size={20} style={{marginRight: 8}} />
          <span>You have {history.length} recent searches</span>
        </div>
        <button style={styles.viewAllButtonLarge} onClick={() => navigate('/history')}>
          <Clock size={18} style={{marginRight: 8}} />
          View Search History
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 30,
    marginBottom: 30,
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  compactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20
  },
  compactTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 600,
    color: '#495057'
  },
  viewAllButtonLarge: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '2px solid #f1f3f5'
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#212529',
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  },
  refreshBtn: {
    background: 'transparent',
    border: '1px solid #dee2e6',
    borderRadius: 6,
    padding: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: '#495057'
  },
  viewAllButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 6px rgba(102, 126, 234, 0.3)'
  },
  historyList: {
    display: 'grid',
    gap: 10
  },
  historyItem: {
    padding: 12,
    background: '#f8f9fa',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid transparent'
  },
  historyContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  historyTerm: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    color: '#212529',
    fontWeight: 500,
    fontSize: 14
  },
  termText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  historyMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d'
  },
  resultsBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: '#667eea',
    background: '#f0f4ff',
    padding: '4px 8px',
    borderRadius: 4
  },
  loading: {
    textAlign: 'center',
    padding: 40,
    color: '#6c757d'
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 40,
    color: '#6c757d',
    fontSize: 14
  }
};
