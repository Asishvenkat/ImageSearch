const express = require('express');
const mongoose = require('mongoose');
const SavedImage = require('../models/SavedImage');

const router = express.Router();

// Helper to check if MongoDB is connected
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Authentication required' });
}

/**
 * POST /api/saved-images
 * Save an image to user's collection
 */
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { imageId, title, url, thumbnail, author, authorUrl, downloadUrl } = req.body;
    const userId = req.user.id;

    // Check if already saved
    const existing = await SavedImage.findOne({ userId, imageId });
    if (existing) {
      return res.status(200).json({ 
        message: 'Image already saved',
        image: existing
      });
    }

    const savedImage = await SavedImage.create({
      userId,
      imageId,
      title,
      url,
      thumbnail,
      author,
      authorUrl,
      downloadUrl
    });

    res.status(201).json({
      message: 'Image saved successfully',
      image: savedImage
    });

  } catch (error) {
    console.error('Save image error:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

/**
 * GET /api/saved-images
 * Get all saved images for the authenticated user
 */
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        images: [],
        total: 0,
        warning: 'Database not available'
      });
    }

    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const images = await SavedImage.find({ userId })
      .sort({ savedAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await SavedImage.countDocuments({ userId });

    res.json({
      images,
      total,
      limit,
      skip
    });

  } catch (error) {
    console.error('Fetch saved images error:', error);
    res.status(500).json({ error: 'Failed to fetch saved images' });
  }
});

/**
 * DELETE /api/saved-images/:id
 * Remove a saved image
 */
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const userId = req.user.id;
    const imageId = req.params.id;

    const result = await SavedImage.findOneAndDelete({
      _id: imageId,
      userId // Ensure user can only delete their own saved images
    });

    if (!result) {
      return res.status(404).json({ error: 'Saved image not found' });
    }

    res.json({
      message: 'Image removed successfully'
    });

  } catch (error) {
    console.error('Delete saved image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

/**
 * POST /api/saved-images/batch
 * Save multiple images at once
 */
router.post('/batch', ensureAuthenticated, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { images } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Images array is required' });
    }

    const savedImages = [];
    const alreadySaved = [];

    for (const img of images) {
      try {
        const existing = await SavedImage.findOne({ userId, imageId: img.id });
        if (existing) {
          alreadySaved.push(img.id);
          continue;
        }

        const savedImage = await SavedImage.create({
          userId,
          imageId: img.id,
          title: img.title,
          url: img.url,
          thumbnail: img.thumbnail,
          author: img.author,
          authorUrl: img.authorUrl,
          downloadUrl: img.downloadUrl
        });
        savedImages.push(savedImage);
      } catch (err) {
        console.error('Error saving image:', img.id, err);
      }
    }

    res.json({
      message: 'Images processed',
      saved: savedImages.length,
      alreadySaved: alreadySaved.length,
      total: images.length
    });

  } catch (error) {
    console.error('Batch save error:', error);
    res.status(500).json({ error: 'Failed to save images' });
  }
});

module.exports = router;
