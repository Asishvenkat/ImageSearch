import React from 'react';

/**
 * UserProfile Component
 * 
 * Displays logged-in user information retrieved from session
 * Shows name, email, avatar, and provider used for authentication
 */

export default function UserProfile({ user, onLogout }) {
  if (!user) return null;

  return (
    <div style={{
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: 8,
      padding: 20,
      maxWidth: 400
    }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Logged In</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        {user.photo && (
          <img 
            src={user.photo} 
            alt={user.name}
            style={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%',
              border: '2px solid #dee2e6'
            }}
          />
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            {user.name}
          </div>
          {user.email && (
            <div style={{ fontSize: 14, color: '#6c757d', marginBottom: 4 }}>
              {user.email}
            </div>
          )}
          <div style={{ 
            fontSize: 12, 
            color: '#fff',
            background: user.provider === 'google' ? '#4285f4' : user.provider === 'github' ? '#24292e' : '#1877f2',
            padding: '2px 8px',
            borderRadius: 4,
            display: 'inline-block'
          }}>
            {user.provider}
          </div>
        </div>
      </div>

      <div style={{ 
        padding: 12, 
        background: '#e9ecef', 
        borderRadius: 4,
        fontSize: 13,
        marginBottom: 12
      }}>
        <strong>Session Data:</strong>
        <pre style={{ margin: '8px 0 0 0', fontSize: 11, overflow: 'auto' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <button
        onClick={onLogout}
        style={{
          padding: '10px 20px',
          background: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 500,
          width: '100%'
        }}
        onMouseOver={(e) => e.target.style.background = '#c82333'}
        onMouseOut={(e) => e.target.style.background = '#dc3545'}
      >
        Logout
      </button>
    </div>
  );
}
