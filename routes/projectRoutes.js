const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const Project = require('../models/ProjetcModel');
const Category = require('../models/CategoryModel');
const Application = require('../models/ApplicationModel');

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
        return res.status(200).json({ data: projects.reverse(), message: "Tous les projets récupérés avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// Obtenir les projets d'un client
router.get('/get_projects/client/:clientId', async (req, res) => {
    try {
        const projects = await Project.find({ clientId: req.params.clientId });
        return res.status(200).json({ data: projects.reverse() });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });
    }
});


router.get('/get_projects_for_artisan/:artisanId', async (req, res) => {
    try {
        const artisanId = req.params.artisanId;

        // Fetch all applications by the artisan
        const applications = await Application.find({ artisanId:artisanId });

        // Extract project IDs from applications
        const appliedProjectIds = applications.map(app => app.projectId.toString());
        // console.log(appliedProjectIds);

        // Fetch all projects
        const allProjects = await Project.find({});

        // console.log(allProjects);
        // Filter projects that have been applied for by the artisan
        const appliedProjects = allProjects.filter(project => 
            appliedProjectIds.includes(project._id.toString())
        );
        // console.log(appliedProjects);

        return res.status(200).json({ data: appliedProjects, message: "Projects applied by the artisan" });
    } catch (error) {
        console.error('Error fetching projects for artisan:', error.message);
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
