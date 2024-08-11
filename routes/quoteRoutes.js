const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quotController');

// Create a new quote
router.post('/register', quoteController.createQuote);

// Get all quotes
router.get('/get_quotes', quoteController.getQuotes);

// Get a single quote by ID
router.get('/get_quote/:id', quoteController.getQuoteById);

// Update a quote by ID
router.put('/edit/:id', quoteController.updateQuote);

// Pay for a quote
router.post('/buy/:id/pay', quoteController.payForQuote);

// Delete a quote by ID
router.delete('/quotes/:id', quoteController.deleteQuote);

module.exports = router;
