const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middlewares/auth');

router.post('/register', authenticateToken, reviewController.createReview);
router.get('/get_reviews', reviewController.getAllReviews);
router.get('/get_reviews/artisan/:artisanId', reviewController.getReviewsByArtisan);
router.get('/get_review/:id', reviewController.getReviewById);
router.patch('/edit/:id', authenticateToken, reviewController.updateReview);
router.put('/hide/:id', authenticateToken, reviewController.hideReview);
router.put('/remove/:id', authenticateToken, reviewController.restoreReview);

module.exports = router;
