const express = require('express');
const router = express.Router();
const Review = require('../models/ReviewModel');
const authenticateToken = require('../middlewares/auth');

// Créer un nouvel avis
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const review = await Review.create({ clientId: req.user.id, ...req.body });
        res.status(201).json({data:review, message:"Nouelle Posté avec succès"});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Obtenir tous les avis
router.get('/get_avis', async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json({data:reviews,message:"Avis"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});


// Obtenir les avis d'un artisan
router.get('/get_avis/artisan/:artisanId', async (req, res) => {
    try {
        const reviews = await Review.findAll({ where: { artisanId: req.params.artisanId } });
        res.status(200).json({data:reviews,message:"Avis de l'artisan récupérer avec succès"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});






// Mettre à jour un avis
router.patch('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Avis non trouvé' });
        }

        await review.update(req.body);
        res.json({data:review,message:"Mise à ajour de votre avis"});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Supprimer un avis
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Avis non trouvé' });
        }

        await review.destroy();
        res.status(200).json({ message: 'Avis supprimer avec succès' });
    } catch (error) {
        res.status(500).json({mesage:error.message});
    }
});

module.exports = router;
