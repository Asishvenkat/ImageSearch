/**
 * OAUTH INTEGRATION EXAMPLES
 * 
 * This file shows different ways to integrate OAuth login in React.
 * Choose the pattern that fits your app structure.
 */

import React, { useState, useEffect } from 'react';

// ============================================================================
// EXAMPLE 1: Simple Login/Logout (Minimal)
// ============================================================================

export function SimpleAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    fetch('http://localhost:5000/api/user', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  return user ? (
    <div>
      <p>Welcome, {user.name}!</p>
      <a href="http://localhost:5000/auth/logout">Logout</a>
    </div>
  ) : (
    <div>
      <a href="http://localhost:5000/auth/google">Login with Google</a>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: With Loading States
// ============================================================================

export function AuthWithLoading() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/user', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? <Dashboard user={user} /> : <LoginPage />;
}

function Dashboard({ user }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <a href="http://localhost:5000/auth/logout">Logout</a>
    </div>
  );
}

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <a href="http://localhost:5000/auth/google">Google</a>
      <a href="http://localhost:5000/auth/github">GitHub</a>
      <a href="http://localhost:5000/auth/facebook">Facebook</a>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Using Custom Hooks (Reusable)
// ============================================================================

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/user', { 
        credentials: 'include' 
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, logout, refetch: fetchUser };
}

export function AppWithHook() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <h1>Please login</h1>
          <a href="http://localhost:5000/auth/google">Login</a>
        </>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: With React Context (Global State)
// ============================================================================

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/user', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

// Usage:
// function App() {
//   return (
//     <AuthProvider>
//       <YourApp />
//     </AuthProvider>
//   );
// }
//
// function YourApp() {
//   const { user, logout } = useAuthContext();
//   return user ? <Dashboard /> : <Login />;
// }

// ============================================================================
// EXAMPLE 5: Protected Route Pattern (React Router)
// ============================================================================

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    // Redirect to login page
    return (
      <div>
        <h1>Access Denied</h1>
        <p>Please login to continue</p>
        <a href="http://localhost:5000/auth/google">Login with Google</a>
      </div>
    );
  }

  return children;
}

// Usage with React Router:
// <Route path="/dashboard" element={
//   <ProtectedRoute>
//     <Dashboard />
//   </ProtectedRoute>
// } />

// ============================================================================
// EXAMPLE 6: Button Click Handler (Alternative to anchor tag)
// ============================================================================

export function LoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:5000/auth/github';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/auth/facebook';
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleGitHubLogin}>Login with GitHub</button>
      <button onClick={handleFacebookLogin}>Login with Facebook</button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Environment Variables (Production Ready)
// ============================================================================

// .env file in client/ folder:
// VITE_API_URL=http://localhost:5000

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function ProductionAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/user`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  return user ? (
    <div>
      <p>Welcome, {user.name}!</p>
      <a href={`${API_URL}/auth/logout`}>Logout</a>
    </div>
  ) : (
    <div>
      <a href={`${API_URL}/auth/google`}>Login with Google</a>
      <a href={`${API_URL}/auth/github`}>Login with GitHub</a>
      <a href={`${API_URL}/auth/facebook`}>Login with Facebook</a>
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Popup Window OAuth (Better UX)
// ============================================================================

export function PopupAuth() {
  const [user, setUser] = useState(null);

  const openOAuthPopup = (provider) => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `http://localhost:5000/auth/${provider}`,
      'oauth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for success message from popup
    const handleMessage = (event) => {
      if (event.data.type === 'oauth-success') {
        popup.close();
        // Refresh user data
        fetch('http://localhost:5000/api/user', { credentials: 'include' })
          .then(r => r.json())
          .then(data => setUser(data.user));
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  return (
    <div>
      <button onClick={() => openOAuthPopup('google')}>
        Login with Google
      </button>
    </div>
  );
}

// Note: For popup pattern, update server callback to send message:
// res.send(`
//   <script>
//     window.opener.postMessage({ type: 'oauth-success' }, '*');
//     window.close();
//   </script>
// `);

// ============================================================================
// EXAMPLE 9: Error Handling
// ============================================================================

export function AuthWithErrorHandling() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/user', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setUser(data.user);
      })
      .catch(err => {
        setError(err.message);
        console.error('Auth error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Checking authentication...</div>;
  if (error) return <div>Error: {error}</div>;

  return user ? <Dashboard user={user} /> : <LoginPage />;
}

// ============================================================================
// QUICK REFERENCE
// ============================================================================

/*

LOGIN (full page redirect):
  <a href="http://localhost:5000/auth/google">Login</a>
  OR
  window.location.href = 'http://localhost:5000/auth/google';

CHECK AUTH (fetch with credentials):
  fetch('http://localhost:5000/api/user', { credentials: 'include' })

LOGOUT (full page redirect):
  <a href="http://localhost:5000/auth/logout">Logout</a>
  OR
  window.location.href = 'http://localhost:5000/auth/logout';

CRITICAL:
  - Always include { credentials: 'include' } in fetch
  - OAuth requires full page redirect (not AJAX)
  - Backend must have CORS with credentials enabled

*/
