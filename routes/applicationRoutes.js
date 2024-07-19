const express = require('express');
const router = express.Router();
const Application = require('../models/ApplicationModel');
const authenticateToken = require('../middlewares/auth');

// Créer une nouvelle candidature
router.post('/', authenticateToken, async (req, res) => {
    try {
        const application = await Application.create({ artisanId: req.user.id, ...req.body });
        res.status(201).json({data:application,message:"Candidature Envoyeé avec succès"});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Obtenir toutes les candidatures
router.get('/get_applications', async (req, res) => {
    try {
        const applications = await Application.findAll();
        res.status(200).json({data:applications,message:"Toutes les candidatures"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

// Obtenir les candidatures par projet
router.get('/project/:projectId', async (req, res) => {
    try {
        const applications = await Application.findAll({ where: { projectId: req.params.projectId } });
        res.status(200).json({data:applications,message:"Toutes les canditures pour ce poste "});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

// Obtenir les candidatures d'un artisan
router.get('/artisan/:artisanId', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.findAll({ where: { artisanId: req.params.artisanId } });
        res.status(200).json({data:applications,message:"les canditure d'un artisans"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

// Mettre à jour une candidature
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) {
            return res.status(404).send({ error: 'Candidature non trouvé' });
        }

        await application.update(req.body);
        res.status(200).json({data:application,message:"Candidature mis à jour"});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Supprimer une candidature
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) {
            return res.status(404).send({ error: 'Candidature non trouvé' });
        }

        await application.destroy();
        res.status(200).json({ message: 'Candidature supprimé' });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});



module.exports = router;


