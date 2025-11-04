const express = require('express');
const passport = require('passport');

const router = express.Router();

// Resolve client root from env so redirects work in different dev setups
const CLIENT_ROOT = process.env.CLIENT_ROOT_URL || 'http://localhost:5173';

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_ROOT}/login` }),
  (req, res) => {
    // Successful authentication, redirect to client
    res.redirect(`${CLIENT_ROOT}/dashboard`);
  }
);

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: `${CLIENT_ROOT}/login` }),
  (req, res) => {
    // Successful authentication, redirect to client
    res.redirect(`${CLIENT_ROOT}/dashboard`);
  }
);

// Facebook OAuth routes
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${CLIENT_ROOT}/login` }),
  (req, res) => {
    // Successful authentication, redirect to client
    res.redirect(`${CLIENT_ROOT}/dashboard`);
  }
);

// Logout
// Logout (browser redirect)
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(CLIENT_ROOT);
  });
});

// Logout (API) - respond with JSON so SPA can call via fetch
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    // Destroy session cookie
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  });
});

module.exports = router;
