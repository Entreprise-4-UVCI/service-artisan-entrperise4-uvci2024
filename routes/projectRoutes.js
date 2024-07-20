const express = require('express');
const router = express.Router();
const Project = require('../models/ProjetcModel');
const authenticateToken = require('../middlewares/auth');

// Créer un nouveau projet
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const project = await Project.create({ clientId: req.user.id, ...req.body });
        res.status(201).json({data:project, message :"Projet créer avec succès "});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Obtenir tous les projets
router.get('/get_projects', async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.status(200).json({data:projects, message:"Tout les projet récupérer avec succès"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

// Obtenir les projets par catégorie
router.get('/get_projects/category/:categoryId', async (req, res) => {
    try {
        const projects = await Project.findAll({ where: { categoryId: req.params.categoryId } });
        res.status(200).json({data:projects});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

// Obtenir les projets d'un client
router.get('/get_projects/client/:clientId', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.findAll({ where: { clientId: req.params.clientId } });
        res.status(200).json({data:projects});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

// Mettre à jour un projet
router.patch('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }

        await project.update(req.body);
        res.send(project);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Supprimer un projet
router.delete('delete/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project trouvé' });
        }
        await project.destroy();
        res.send({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).send({message:error.message});
    }
});

module.exports = router;
