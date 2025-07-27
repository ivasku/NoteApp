const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, isImportant: -1 });

module.exports = mongoose.model('Note', noteSchema);