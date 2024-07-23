const express = require('express');
const router = express.Router();
const Review = require('../models/ReviewModel');
const authenticateToken = require('../middlewares/auth');

// Créer un nouvel avis
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json({ data: review, message: "Nouvel avis posté avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtenir tous les avis
router.get('/get_reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ data: reviews, message: "Tous les avis" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les avis d'un artisan
router.get('/get_reviews/artisan/:artisanId', async (req, res) => {
    try {
        const reviews = await Review.find({ artisanId: req.params.artisanId });
        res.status(200).json({ data: reviews, message: "Avis de l'artisan récupérés avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir un avis spécifique
router.get('/get_review/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        res.status(200).json({ data: review, message: "Avis récupéré avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un avis
router.patch('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) {
            return res.status(404).json({ message: 'Avis non trouvé' });
        }
        res.status(200).json({ data: review, message: "Avis mis à jour" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un avis (mettre à jour pour le cacher)
router.put('/hide/:id', authenticateToken, async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { access: false }, { new: true });
        if (!review) {
            return res.status(404).json({ message: 'Avis non trouvé' });
        }
        res.status(200).json({ message: 'Avis supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Restaurer un avis
router.put('/remove/:id', authenticateToken, async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { access: true }, { new: true });
        if (!review) {
            return res.status(404).json({ message: 'Avis non trouvé' });
        }
        res.status(200).json({ message: 'Avis restauré avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
