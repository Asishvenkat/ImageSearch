const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// Mock user database (replace with real DB in production)
const users = {};
let userId = 0;

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  done(null, users[id] || null);
});

// Resolve server and client roots from env (useful for callback/redirect URLs)
const SERVER_ROOT = process.env.SERVER_ROOT_URL || `http://localhost:${process.env.PORT || 5000}`;
const CLIENT_ROOT = process.env.CLIENT_ROOT_URL || 'http://localhost:5173';

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Use absolute callback URL to avoid redirect_uri_mismatch errors
        callbackURL: process.env.GOOGLE_CALLBACK_URL || `${SERVER_ROOT}/auth/google/callback`
      },
      (accessToken, refreshToken, profile, done) => {
        let user = Object.values(users).find((u) => u.googleId === profile.id);
        if (!user) {
          userId++;
          user = {
            id: userId,
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0]?.value,
            photo: profile.photos[0]?.value,
            provider: 'google'
          };
          users[user.id] = user;
        }
        done(null, user);
      }
    )
  );
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || `${SERVER_ROOT}/auth/github/callback`,
        scope: ['user:email']
      },
      (accessToken, refreshToken, profile, done) => {
        let user = Object.values(users).find((u) => u.githubId === profile.id);
        if (!user) {
          userId++;
          user = {
            id: userId,
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || profile._json?.email || null,
            photo: profile.photos?.[0]?.value || profile._json?.avatar_url || null,
            provider: 'github'
          };
          users[user.id] = user;
        }
        done(null, user);
      }
    )
  );
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || `${SERVER_ROOT}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      (accessToken, refreshToken, profile, done) => {
        let user = Object.values(users).find((u) => u.facebookId === profile.id);
        if (!user) {
          userId++;
          user = {
            id: userId,
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            photo: profile.photos[0]?.value,
            provider: 'facebook'
          };
          users[user.id] = user;
        }
        done(null, user);
      }
    )
  );
}
