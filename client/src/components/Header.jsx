import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Save, LogOut } from 'lucide-react';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [savedCount, setSavedCount] = useState(0);
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  // Fetch saved items count when user is logged in
  useEffect(() => {
    if (user) {
      fetchSavedCount();
      // Refresh count every 5 seconds
      const interval = setInterval(fetchSavedCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchSavedCount = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/saved-images`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSavedCount(data.images?.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch saved count:', err);
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo/Brand */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="url(#gradient)" />
                <path
                  d="M16 8L12 16H16V24L20 16H16V8Z"
                  fill="white"
                  opacity="0.9"
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style={styles.brandText}>
              <div style={styles.brandName}>ImageSearch</div>
              <div style={styles.brandTagline}>Find & Select Amazing Images</div>
            </div>
          </div>
        </Link>

        {/* Navigation & User Info */}
        <nav style={styles.nav}>
          {user ? (
            <>
              {/* Search History Button */}
              <button onClick={() => navigate('/history')} style={styles.historyButton}>
                <Clock size={16} />
                <span>History</span>
              </button>

              {/* Saved Items Button */}
              <button onClick={() => navigate('/saved')} style={styles.savedItemsButton}>
                <Save size={16} />
                <span>Saved Items</span>
                {savedCount > 0 && (
                  <span style={styles.badge}>{savedCount}</span>
                )}
              </button>

              <div style={styles.userInfo}>
                {user.photo && (
                  <img
                    src={user.photo}
                    alt={user.name}
                    style={styles.avatar}
                  />
                )}
                <div style={styles.userDetails}>
                  <div style={styles.userName}>{user.name}</div>
                  <div style={styles.userProvider}>
                    via {user.provider?.toUpperCase()}
                  </div>
                </div>
              </div>
              <button onClick={onLogout} style={styles.logoutButton}>
                <LogOut size={16} style={{marginRight: 6}} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.loginButton}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e1e4e8',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    userSelect: 'none',
    transition: 'opacity 0.2s ease',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
  },
  brandTagline: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '6px 12px',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1f2937',
  },
  userProvider: {
    fontSize: 11,
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: '0.05em',
  },
  loginButton: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  historyButton: {
    padding: '8px 16px',
    background: '#fff',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  savedItemsButton: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    position: 'relative',
  },
  badge: {
    background: '#fff',
    color: '#667eea',
    fontSize: 12,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 12,
    marginLeft: 4,
    minWidth: 20,
    textAlign: 'center',
  },
};
