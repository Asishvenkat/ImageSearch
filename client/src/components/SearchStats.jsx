import React, { useState, useEffect } from 'react';

export default function SearchStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/search/stats', {
      credentials: 'include'
    })
      .then(r => {
        if (!r.ok) throw new Error('Not authenticated');
        return r.json();
      })
      .then(data => {
        setStats(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.error('Failed to fetch stats:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading stats...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#dc3545' }}>⚠️ {error}</p>
        <p style={{ fontSize: 14, color: '#6c757d' }}>
          Please login to view your search statistics.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search Statistics</h2>

      <div style={styles.card}>
        <div style={styles.statNumber}>{stats.totalSearches}</div>
        <div style={styles.statLabel}>Total Searches</div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Top Searches</h3>
        <div style={styles.chartContainer}>
          {stats.topSearches.map((item, index) => (
            <div key={item.term} style={styles.barItem}>
              <div style={styles.barLabel}>
                <span style={styles.rank}>#{index + 1}</span>
                <span>{item.term}</span>
              </div>
              <div style={styles.barContainer}>
                <div
                  style={{
                    ...styles.bar,
                    width: `${(item.count / stats.topSearches[0].count) * 100}%`
                  }}
                />
                <span style={styles.barValue}>{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recent Searches</h3>
        <div style={styles.recentList}>
          {stats.recentSearches.map((item) => (
            <div key={item._id} style={styles.recentItem}>
              <span>🔍 {item.term}</span>
              <span style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 800,
    margin: '0 auto'
  },
  title: {
    margin: '0 0 24px 0',
    fontSize: 28,
    fontWeight: 600
  },
  card: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    borderRadius: 12,
    padding: 32,
    textAlign: 'center',
    marginBottom: 32
  },
  statNumber: {
    fontSize: 48,
    fontWeight: 700,
    marginBottom: 8
  },
  statLabel: {
    fontSize: 16,
    opacity: 0.9
  },
  section: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 16
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  barItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  barLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14
  },
  rank: {
    background: '#e9ecef',
    color: '#495057',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600
  },
  barContainer: {
    position: 'relative',
    height: 32,
    background: '#f8f9fa',
    borderRadius: 6,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center'
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease'
  },
  barValue: {
    position: 'absolute',
    right: 12,
    fontSize: 13,
    fontWeight: 600,
    color: '#495057'
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 12,
    background: '#f8f9fa',
    borderRadius: 6,
    fontSize: 14
  },
  timestamp: {
    color: '#6c757d',
    fontSize: 13
  }
};
