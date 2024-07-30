const express = require('express');
const router = express.Router();
const Application = require('../models/ApplicationModel');
const authenticateToken = require('../middlewares/auth');

// Créer une nouvelle candidature
router.post('/register', async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        return res.status(201).json({ data: application, message: "Candidature envoyée avec succès" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});



// Accepté
router.post('/register/:id', async (req, res) => {
    try {
        const idApplication =  req.params.id;

        const applicationExist = await Application({_id:idApplication});
        if(applicationExist){
            return res.status(410).json({ message:"Candidature non trouvé"});
        }
        applicationExist.status = "ACCEPTED" ;

        await applicationExist.save();
        
        return res.status(200).json({ data: applicationExist, message: "Candidature Accepté avec succès" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


// Obtenir toutes les candidatures
router.get('/get_applications', async (req, res) => {
    try {
        const applications = await Application.find()
        .populate({
            path: 'projectId',
            select: 'title description createdAt category skills' // specify the fields you want
        })
        .populate({
            path: 'artisanId',
            select: 'firstname lastname phone codePostal email' // specify the fields you want
        });

        return res.status(200).json({ data: applications, message: "Toutes les candidatures" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Obtenir les candidatures par projet
router.get('/get_applications/project/:projectId', async (req, res) => {
    try {
        const applications = await Application.find({ projectId: req.params.projectId })
        .populate({
            path: 'projectId',
            select: 'title description createdAt category skills' // specify the fields you want
        })
        .populate({
            path: 'artisanId',
            select: 'firstname lastname phone codePostal email' // specify the fields you want
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtenir les candidatures d'un artisan
router.get('/get_applications/artisan/:artisanId', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.find({ artisanId: req.params.artisanId })
        .populate("projectId._id,projectId.name,projectId.description,projectId.createdAt,projectId.category,projectId.skills",)
        .populate("artisanId._id,artisanId.firstname,artisanId.lastname,artisanId.phone,artisanId.codePostal",);


        return res.status(200).json({ data: applications, message: "Les candidatures d'un artisan" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Mettre à jour une candidature
router.patch('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!application) {
            return res.status(404).send({ error: 'Candidature non trouvée' });
        }
        return res.status(200).json({ data: application, message: "Candidature mise à jour" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Supprimer une candidature
router.delete('/deleted/:id', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).send({ error: 'Candidature non trouvée' });
        }
        return res.status(200).json({ message: 'Candidature supprimée' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
