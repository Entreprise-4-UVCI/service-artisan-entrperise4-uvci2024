const express = require('express');
const router = express.Router();
const { createPortfolio, getPortfolio, updatePortfolio, deletePortfolio, getAllPortfolios, getAllPortfoliosAll } = require('../controllers/portfolioController');
const authenticateToken = require('../middlewares/auth');

// Créer un portfolio
router.post('/register', createPortfolio);

// Obtenir un portfolio par ID
router.get('/get_portfolio/:id', getPortfolio);

// Obtenir tous les portfolios d'un artisan
router.get('/get_portfolios/artisan/:artisanId', getAllPortfolios);


router.get('/get_portfolios', getAllPortfoliosAll);

// Mettre à jour un portfolio
router.put('/edit/:id', updatePortfolio);

// Supprimer un portfolio
router.put('/delete/:id', deletePortfolio);

module.exports = router;
