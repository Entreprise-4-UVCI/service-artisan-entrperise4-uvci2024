const express = require('express');
const router = express.Router();
const Application = require('../models/ApplicationModel');
const authenticateToken = require('../middlewares/auth');

// Créer une nouvelle candidature
router.post('/register', async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json({ data: application, message: "Candidature envoyée avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtenir toutes les candidatures
router.get('/get_applications', async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json({ data: applications, message: "Toutes les candidatures" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les candidatures par projet
router.get('/get_applications/project/:projectId', async (req, res) => {
    try {
        const applications = await Application.find({ projectId: req.params.projectId });
        res.status(200).json({ data: applications, message: "Toutes les candidatures pour ce projet" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les candidatures d'un artisan
router.get('/get_applications/artisan/:artisanId', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.find({ artisanId: req.params.artisanId });
        res.status(200).json({ data: applications, message: "Les candidatures d'un artisan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour une candidature
router.patch('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!application) {
            return res.status(404).send({ error: 'Candidature non trouvée' });
        }
        res.status(200).json({ data: application, message: "Candidature mise à jour" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer une candidature
router.delete('/deleted/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).send({ error: 'Candidature non trouvée' });
        }
        res.status(200).json({ message: 'Candidature supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
