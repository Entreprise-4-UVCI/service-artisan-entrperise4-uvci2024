const express = require('express');
const router = express.Router();
const { createPublication, getPublication, updatePublication, deletePublication, getAllPublications } = require('../controllers/publicationController');
const authenticateToken = require('../middlewares/auth');

// Créer une publication
router.post('/register', createPublication);

// Obtenir une publication par ID
router.get('/get_publication/:id', getPublication);

// Obtenir toutes les publications d'un artisan
router.get('/get_publications/artisan/:artisanId', getAllPublications);

// Mettre à jour une publication
router.patch('/edit/:id', updatePublication);

// Supprimer une publication
router.delete('/delete/:id', deletePublication);

module.exports = router;
