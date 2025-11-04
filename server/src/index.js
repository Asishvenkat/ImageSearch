const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Debug: verify dotenv loaded the Unsplash key at runtime (remove in prod)
console.log('UNSPLASH_ACCESS_KEY present?', !!process.env.UNSPLASH_ACCESS_KEY);

// Import database connection
const connectDB = require('./config/database');

// Import Passport config
require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const savedImagesRoutes = require('./routes/savedImages');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.use('/auth', authRoutes);

// Search routes
app.use('/api', searchRoutes);

// Saved images routes
app.use('/api/saved-images', savedImagesRoutes);

// Simple /api/images endpoint returning placeholder image objects.
// Later you can replace with a real image API (server-side key kept secret).
app.get('/api/images', (req, res) => {
  const q = req.query.q || 'random';
  // Sample placeholder images (unsplash source URLs). For production, use an image API.
  const results = Array.from({ length: 12 }).map((_, i) => ({
    id: `${q}-${i}`,
    title: `${q} image ${i + 1}`,
    url: `https://source.unsplash.com/collection/190727/400x300?sig=${i}`
  }));

  res.json({ query: q, results });
});

// Current user endpoint
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
