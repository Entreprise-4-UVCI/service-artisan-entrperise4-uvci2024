const express = require('express');
const router = express.Router();
const Category = require('../models/CategoryModel');
const authenticateToken = require('../middlewares/auth');

// Créer un nouvel avis
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ data: category, message: "Nouvelle catégorie  avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtenir tous les avis
router.get('/get_categorys', async (req, res) => {
    try {
        const categorys = await Category.find();
        res.status(200).json({ data: categorys, message: "Tous les avis" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les avis d'un artisan
router.get('/get_categorys/artisan/:artisanId', async (req, res) => {
    try {
        const categorys = await Category.find({ artisanId: req.params.artisanId });
        res.status(200).json({ data: categorys, message: "catégorie d'un artisan récupérés avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Obtenir un avis spécifique
router.get('/get_category/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json({ data: category, message: "catégorie récupéré avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un avis
router.patch('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'catégorie non trouvé' });
        }
        res.status(200).json({ data: category, message: "Compétence mis à jour" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un avis (mettre à jour pour le cacher)
router.put('/hide/:id', authenticateToken, async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { access: false }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvé' });
        }
        res.status(200).json({ message: 'Compétence supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Restaurer un avis
router.put('/remove/:id', authenticateToken, async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { access: true }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvé' });
        }
        res.status(200).json({ message: 'Catégorie restauré avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;



