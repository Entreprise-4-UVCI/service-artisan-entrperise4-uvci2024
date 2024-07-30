const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const Project = require('../models/ProjetcModel');
const Category = require('../models/CategoryModel');

// Créer un nouveau projet
router.post('/register', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        return res.status(201).json({ data: project, message: "Projet créé avec succès" });
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: error.message });
    }
});

// Obtenir tous les projets
router.get('/get_projects', async (req, res) => {
    try {
        const projects = await Project.find();
        return res.status(200).json({ data: projects, message: "Tous les projets récupérés avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// Obtenir les projets d'un client
router.get('/get_projects/client/:clientId', async (req, res) => {
    try {
        const projects = await Project.find({ clientId: req.params.clientId });
        return res.status(200).json({ data: projects });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });
    }
});



// Obtenir les projets d'un client
router.get('/get_project/:id', async (req, res) => {
    try {
        const project = await Project.findById({ _id: req.params.id });
        return res.status(200).json({ data: project,message:"Projet" });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });
    }
});




// Mettre à jour un projet
router.put('/edit/:id', async (req, res) => {
    try {
        
        const  idProject =  req.params.id;
        const projectExist = await Project.findById({_id: idProject });
        
        if (!projectExist) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        const project = await Project.findByIdAndUpdate({_id:req.params.id}, req.body, { new: true });
        return res.status(200).json({ data: project, message: "Projet mis à jour avec succès" });
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: error.message });
    }
});

// Supprimer un projet
router.delete('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        return res.status(200).json({ message: 'Projet supprimé' });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
