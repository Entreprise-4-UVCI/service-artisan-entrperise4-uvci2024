const express = require('express');
const router = express.Router();
const { createPayment, getPayment, updatePayment, deletePayment, getAllPayments } = require('../controllers/paymentController');
const authenticateToken = require('../middlewares/auth');

// Créer un paiement
router.post('/register', authenticateToken, createPayment);

// Obtenir un paiement par ID
router.get('/get_payment/:id', getPayment);

// Obtenir tous les paiements d'un artisan
router.get('/get_payments/artisan/:artisanId', getAllPayments);

// Mettre à jour un paiement
router.patch('/edit/:id', authenticateToken, updatePayment);

// Supprimer un paiement
router.delete('/delete/:id', authenticateToken, deletePayment);

module.exports = router;
