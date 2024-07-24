const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const Project = require('../models/ProjetcModel');
const Category = require('../models/CategoryModel');

// Créer un nouveau projet
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const project = new Project({ clientId: req.user.id, ...req.body });
        await project.save();
        res.status(201).json({ data: project, message: "Projet créé avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtenir tous les projets
router.get('/get_projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ data: projects, message: "Tous les projets récupérés avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les projets par catégorie
router.get('/get_projects/category/:categoryId', async (req, res) => {
    try {
        const projects = await Project.find({ category: req.params.categoryId });
        res.status(200).json({ data: projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les projets d'un client
router.get('/get_projects/client/:clientId', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ clientId: req.params.clientId });
        res.status(200).json({ data: projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un projet
router.patch('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) {
            return res.status(404).send({ message: 'Projet non trouvé' });
        }
        res.status(200).json({ data: project, message: "Projet mis à jour avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un projet
router.delete('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.status(200).json({ message: 'Projet supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
