import React, { useState, useEffect } from 'react';
import LoginButtons from './components/LoginButtons';
import UserProfile from './components/UserProfile';

/**
 * OAuth Demo Page
 * 
 * This demonstrates the complete OAuth flow:
 * 1. Display login buttons when not authenticated
 * 2. Fetch user session on page load
 * 3. Display user profile when authenticated
 * 4. Handle logout
 */

export default function OAuthDemo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user session on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    setLoading(true);
    setError(null);
    
    fetch('http://localhost:5000/api/user', { 
      credentials: 'include'  // CRITICAL: Send session cookies
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        return res.json();
      })
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(err => {
        setError(err.message);
        console.error('Auth check failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = () => {
    // OAuth logout requires full page redirect
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: 16, color: '#6c757d' }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>OAuth Authentication Demo</h1>
        <p style={styles.subtitle}>
          Google, GitHub, and Facebook login via Passport.js
        </p>

        <div style={styles.divider}></div>

        {user ? (
          // Authenticated View
          <div>
            <UserProfile user={user} onLogout={handleLogout} />
            
            <div style={styles.infoBox}>
              <strong>🎉 You're logged in!</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: 14 }}>
                Session is stored in cookies. Refresh the page to verify persistence.
              </p>
            </div>
          </div>
        ) : (
          // Login View
          <div>
            <div style={styles.infoBox}>
              <strong>🔐 Choose a provider to login:</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: 14 }}>
                Click a button below to start the OAuth flow. You'll be redirected to the provider's login page.
              </p>
            </div>

            <LoginButtons />

            {error && (
              <div style={styles.errorBox}>
                <strong>⚠️ Not authenticated</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: 13 }}>
                  {error}
                </p>
              </div>
            )}
          </div>
        )}

        <div style={styles.divider}></div>

        <div style={styles.codeSection}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>How it works:</h3>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
            <li>Click login button → redirects to <code>/auth/google</code></li>
            <li>Backend redirects to provider (Google/GitHub/Facebook)</li>
            <li>You authenticate with the provider</li>
            <li>Provider redirects back to <code>/auth/google/callback</code></li>
            <li>Backend creates session & redirects to app</li>
            <li>Frontend fetches <code>/api/user</code> to get user data</li>
          </ol>
        </div>

        <button
          onClick={fetchUser}
          style={styles.refreshButton}
          onMouseOver={(e) => e.target.style.background = '#0056b3'}
          onMouseOut={(e) => e.target.style.background = '#007bff'}
        >
          🔄 Refresh Auth Status
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'Inter, Arial, sans-serif'
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: 40,
    maxWidth: 500,
    width: '100%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: 28,
    fontWeight: 700,
    color: '#212529'
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: '#6c757d'
  },
  divider: {
    height: 1,
    background: '#dee2e6',
    margin: '24px 0'
  },
  infoBox: {
    background: '#e7f3ff',
    border: '1px solid #b3d9ff',
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
    fontSize: 14
  },
  errorBox: {
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: 6,
    padding: 16,
    marginTop: 20,
    fontSize: 14,
    color: '#856404'
  },
  codeSection: {
    background: '#f8f9fa',
    borderRadius: 6,
    padding: 16,
    fontSize: 14
  },
  refreshButton: {
    width: '100%',
    padding: '12px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    marginTop: 16,
    transition: 'background 0.2s'
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  }
};
