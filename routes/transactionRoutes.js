const express = require('express');
const router = express.Router();
const { createTransaction, getTransaction, updateTransaction, deleteTransaction, getAllTransactions } = require('../controllers/transactionController');
const authenticateToken = require('../middlewares/auth');

// Créer une transaction
router.post('/register', createTransaction);

// Obtenir une transaction par ID
router.get('/get_transaction/:id', getTransaction);

// Obtenir toutes les transactions d'un utilisateur
router.get('/get_transactions/user/:userId', getAllTransactions);

// Mettre à jour une transaction
router.patch('/edit/:id', updateTransaction);

// Supprimer une transaction
router.delete('/delete/:id', deleteTransaction);

module.exports = router;
