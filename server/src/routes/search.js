const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const SearchHistory = require('../models/SearchHistory');

const router = express.Router();

// Helper to check if MongoDB is connected
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * POST /api/search
 * Body: { term: string }
 *
 * Only authenticated users may perform searches. This middleware enforces that.
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Authentication required' });
}

router.post('/search', ensureAuthenticated, async (req, res) => {
  try {
    const { term } = req.body;

    // Validate input
    if (!term || typeof term !== 'string' || term.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search term is required and must be a non-empty string' 
      });
    }

  // User is authenticated (middleware ensured this)
  const userId = req.user?.id;

    // Validate Unsplash API key
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error('UNSPLASH_ACCESS_KEY is not set in .env');
      // Return placeholder data if no API key
      return res.json({
        term,
        results: generatePlaceholderImages(term.trim()),
        total: 12,
        source: 'placeholder'
      });
    }

    // Call Unsplash API
    const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: term.trim(),
        per_page: 30,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    const results = unsplashResponse.data.results.map(photo => ({
      id: photo.id,
      title: photo.description || photo.alt_description || term,
      url: photo.urls.regular,
      thumbnail: photo.urls.small,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      downloadUrl: photo.links.download
    }));

    // Store search history in MongoDB (only if connected)
    if (isDbConnected()) {
      SearchHistory.create({
        userId,
        term: term.trim(),
        timestamp: new Date(),
        resultsCount: results.length
      }).catch(err => console.error('Failed to save search history:', err));
    }

    // Return results
    res.json({
      term: term.trim(),
      results,
      total: unsplashResponse.data.total,
      source: 'unsplash'
    });

  } catch (error) {
    console.error('Search API Error:', error.message);

    // If Unsplash API fails, return placeholder data
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid Unsplash API key. Please check your .env configuration.' 
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({ 
        error: 'Unsplash API rate limit exceeded. Please try again later.' 
      });
    }

    // Return placeholder for any other error
    res.json({
      term: req.body.term?.trim() || 'random',
      results: generatePlaceholderImages(req.body.term?.trim() || 'random'),
      total: 12,
      source: 'placeholder',
      warning: 'Using placeholder images due to API error'
    });
  }
});

/**
 * GET /api/search/history
 * Returns user's search history (requires authentication)
 */
router.get('/search/history', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if database is connected
    if (!isDbConnected()) {
      return res.json({
        history: [],
        total: 0,
        limit: 0,
        skip: 0,
        warning: 'Database not available'
      });
    }

    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const history = await SearchHistory.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .select('term timestamp resultsCount');

    const total = await SearchHistory.countDocuments({ userId: req.user.id });

    res.json({
      history,
      total,
      limit,
      skip
    });

  } catch (error) {
    console.error('Search history error:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

/**
 * GET /api/search/stats
 * Returns search statistics for authenticated user
 */
router.get('/search/stats', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if database is connected
    if (!isDbConnected()) {
      return res.json({
        totalSearches: 0,
        topSearches: [],
        recentSearches: [],
        warning: 'Database not available'
      });
    }

    const totalSearches = await SearchHistory.countDocuments({ userId: req.user.id });
    
    const topSearches = await SearchHistory.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$term', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const recentSearches = await SearchHistory.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(5)
      .select('term timestamp');

    res.json({
      totalSearches,
      topSearches: topSearches.map(s => ({ term: s._id, count: s.count })),
      recentSearches
    });

  } catch (error) {
    console.error('Search stats error:', error);
    res.status(500).json({ error: 'Failed to fetch search stats' });
  }
});

/**
 * GET /api/top-searches
 * Returns top 5 most frequent search terms across all users
 * Public endpoint - no authentication required
 */
router.get('/top-searches', async (req, res) => {
  try {
    // Check if database is connected
    if (!isDbConnected()) {
      return res.json({
        topSearches: [],
        total: 0,
        generatedAt: new Date(),
        warning: 'Database not available'
      });
    }

    const limit = parseInt(req.query.limit) || 5;

    const topSearches = await SearchHistory.aggregate([
      // Group by term and count occurrences
      {
        $group: {
          _id: '$term',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          lastSearched: { $max: '$timestamp' }
        }
      },
      // Add computed field for unique user count
      {
        $addFields: {
          userCount: { $size: '$uniqueUsers' }
        }
      },
      // Sort by count descending
      {
        $sort: { count: -1 }
      },
      // Limit to top N
      {
        $limit: limit
      },
      // Project final structure
      {
        $project: {
          _id: 0,
          term: '$_id',
          count: 1,
          userCount: 1,
          lastSearched: 1
        }
      }
    ]);

    res.json({
      topSearches,
      total: topSearches.length,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Top searches error:', error);
    res.status(500).json({ 
      topSearches: [],
      total: 0,
      generatedAt: new Date(),
      error: 'Failed to fetch top searches' 
    });
  }
});

// Helper function to generate placeholder images
function generatePlaceholderImages(term) {
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `${term}-${i}`,
    title: `${term} image ${i + 1}`,
    url: `https://source.unsplash.com/800x600/?${encodeURIComponent(term)}&sig=${i}`,
    thumbnail: `https://source.unsplash.com/400x300/?${encodeURIComponent(term)}&sig=${i}`,
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
    downloadUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(term)}&sig=${i}`
  }));
}

module.exports = router;
