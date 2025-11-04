const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  term: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  resultsCount: {
    type: Number,
    default: 0
  }
});

// Index for efficient queries
searchHistorySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
