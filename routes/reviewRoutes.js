const express = require('express');
const router = express.Router();
const Review = require('../models/ReviewModel');
const authenticateToken = require('../middlewares/auth');

// Créer un nouvel avis
router.post('/', authenticateToken, async (req, res) => {
    try {
        const review = await Review.create({ clientId: req.user.id, ...req.body });
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtenir tous les avis
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).send(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtenir les avis d'un artisan
router.get('/artisan/:artisanId', async (req, res) => {
    try {
        const reviews = await Review.findAll({ where: { artisanId: req.params.artisanId } });
        res.status(200).send(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Mettre à jour un avis
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).send({ error: 'Review not found' });
        }

        await review.update(req.body);
        res.send(review);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Supprimer un avis
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).send({ error: 'Review not found' });
        }

        await review.destroy();
        res.send({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
