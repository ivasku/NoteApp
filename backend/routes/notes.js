const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notes
// @desc    Get all notes for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, important, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (important === 'true') {
      query.isImportant = true;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get notes with pagination
    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Note.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        notes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notes'
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a single note
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { note }
    });

  } catch (error) {
    console.error('Get note error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching note'
    });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, isImportant } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Create note
    const note = new Note({
      title,
      content,
      category: category || 'General',
      isImportant: isImportant || false,
      user: req.user._id
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { note }
    });

  } catch (error) {
    console.error('Create note error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating note'
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, category, isImportant } = req.body;

    // Find note
    let note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (isImportant !== undefined) note.isImportant = isImportant;

    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: { note }
    });

  } catch (error) {
    console.error('Update note error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating note'
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting note'
    });
  }
});

// @route   GET /api/notes/stats/summary
// @desc    Get notes statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Note.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          important: { $sum: { $cond: ['$isImportant', 1, 0] } },
          categories: { $addToSet: '$category' }
        }
      }
    ]);

    const result = stats[0] || { total: 0, important: 0, categories: [] };

    res.status(200).json({
      success: true,
      data: {
        totalNotes: result.total,
        importantNotes: result.important,
        categories: result.categories
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;