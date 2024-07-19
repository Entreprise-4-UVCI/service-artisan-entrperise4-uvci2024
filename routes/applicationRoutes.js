const express = require('express');
const router = express.Router();
const Application = require('../models/ApplicationModel');
const authenticateToken = require('../middlewares/auth');

// Créer une nouvelle candidature
router.post('/', authenticateToken, async (req, res) => {
    try {
        const application = await Application.create({ artisanId: req.user.id, ...req.body });
        res.status(201).send(application);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtenir toutes les candidatures
router.get('/', async (req, res) => {
    try {
        const applications = await Application.findAll();
        res.status(200).send(applications);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtenir les candidatures par projet
router.get('/project/:projectId', async (req, res) => {
    try {
        const applications = await Application.findAll({ where: { projectId: req.params.projectId } });
        res.status(200).send(applications);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtenir les candidatures d'un artisan
router.get('/artisan/:artisanId', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.findAll({ where: { artisanId: req.params.artisanId } });
        res.status(200).send(applications);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Mettre à jour une candidature
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) {
            return res.status(404).send({ error: 'Application not found' });
        }

        await application.update(req.body);
        res.send(application);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Supprimer une candidature
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) {
            return res.status(404).send({ error: 'Application not found' });
        }

        await application.destroy();
        res.send({ message: 'Application deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
