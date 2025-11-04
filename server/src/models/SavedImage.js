const mongoose = require('mongoose');

const savedImageSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  imageId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  author: {
    type: String
  },
  authorUrl: {
    type: String
  },
  downloadUrl: {
    type: String
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't save the same image twice
savedImageSchema.index({ userId: 1, imageId: 1 }, { unique: true });

module.exports = mongoose.model('SavedImage', savedImageSchema);
