import React, { useState, useEffect } from 'react';

export default function SearchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/search/history?limit=20', {
      credentials: 'include'
    })
      .then(r => {
        if (!r.ok) throw new Error('Not authenticated');
        return r.json();
      })
      .then(data => {
        setHistory(data.history || []);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.error('Failed to fetch history:', err);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <div style={styles.container}>Loading search history...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#dc3545' }}>⚠️ {error}</p>
        <p style={{ fontSize: 14, color: '#6c757d' }}>
          Please login to view your search history.
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div style={styles.container}>
        <p>No search history yet. Start searching for images!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search History</h2>
      <div style={styles.list}>
        {history.map((item) => (
          <div key={item._id} style={styles.item}>
            <div style={styles.term}>🔍 {item.term}</div>
            <div style={styles.meta}>
              <span>{new Date(item.timestamp).toLocaleString()}</span>
              <span style={styles.badge}>{item.resultsCount} results</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 600,
    margin: '0 auto'
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: 24,
    fontWeight: 600
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  item: {
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: 8,
    padding: 16,
    transition: 'box-shadow 0.2s',
    cursor: 'default'
  },
  term: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#6c757d'
  },
  badge: {
    background: '#e9ecef',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12
  }
};
