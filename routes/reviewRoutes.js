const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middlewares/auth');

router.post('/register', reviewController.createReview);
router.get('/get_reviews', reviewController.getAllReviews);
router.get('/get_reviews/client/:artisanId', reviewController.getReviewsByClient);
router.get('/get_reviews/artisan/:artisanId', reviewController.getReviewsByArtisanView);
router.get('/get_review/:id', reviewController.getReviewById);
router.patch('/edit/:id', reviewController.updateReview);
router.put('/hide/:id', reviewController.hideReview);
router.put('/remove/:id', reviewController.restoreReview);

module.exports = router;
