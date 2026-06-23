const express = require('express');
const router = express.Router();
const { getReviews, addReview } = require('../services/airtable');

router.get('/', async (req, res) => {
  try {
    const reviews = await getReviews();
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ success: false, error: 'Name and comment are required' });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }
    const review = await addReview({ name, rating, comment });
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
