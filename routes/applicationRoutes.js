const express = require('express');
const router = express.Router();
const Application = require('../models/ApplicationModel');
const authenticateToken = require('../middlewares/auth');

// Créer une nouvelle candidature
router.post('/register', async (req, res) => {
    try {
        const application = new Application(req.body);
        application.status ="PENDING";

        await application.save();
        return res.status(201).json({ data: application, message: "Candidature envoyée avec succès" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});



// Accepted
router.post('/accepted/:id', async (req, res) => {
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



// Reject 
router.post('/reject/:id', async (req, res) => {
    try {
        const idApplication =  req.params.id;

        const applicationExist = await Application({_id:idApplication});
        if(applicationExist){
            return res.status(410).json({ message:"Candidature non trouvé"});
        }
        applicationExist.status = "REJECTED" ;

        await applicationExist.save();

        return res.status(200).json({ data: applicationExist, message: "Candidature Réjété avec succès" });
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
            select: 'title description minBudget maxBudget deadline createdAt category skills' // specify the fields you want
        })
        .populate({
            path: 'artisanId',
            select: 'firstname lastname phone codePostal email' // specify the fields you want
        });
        return res.status(200).json({data:applications,message:"Recupérer toutes les candidatures d'un project"});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtenir les candidatures d'un artisan
router.get('/get_applications/artisan/:artisanId', async (req, res) => {
    try {
        const  idArtisan =  req.params.clientId;
        const applications = await Application.find({ artisanId: idArtisan })
        .populate({
            path: 'projectId',
            select: 'title description minBudget maxBudget deadline createdAt category skills' // specify the fields you want
        })
        .populate({
            path: 'artisanId',
            select: 'firstname lastname phone codePostal email' // specify the fields you want
        });


        return res.status(200).json({ data: applications, message: "Les candidatures d'un artisan" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});




router.get('/get_applications/client/:clientId', async (req, res) => {
    try {
        const idClient = req.params.clientId;

        // Debug log to verify the client ID being searched
        console.log(`Fetching applications for client ID: ${idClient}`);

        // Find applications where the project's clientId matches the provided idClient
        const applications = await Application.find()
            .populate({
                path: 'projectId',
                match: { clientId: idClient }, // Filter projects by clientId
                select: 'title description minBudget maxBudget deadline createdAt category skills' // Specify the fields to return
            })
            .populate({
                path: 'artisanId',
                select: 'firstname lastname phone codePostal email' // Specify the fields to return
            })
            .exec();

        // Debug log to see the applications before filtering
        console.log('Applications before filtering:', applications);

        // Filter out applications where the projectId is null due to the match condition
        const filteredApplications = applications.filter(app => app.projectId !== null);

        // Debug log to see the filtered applications
        console.log('Filtered Applications:', filteredApplications);

        return res.status(200).json({ data: filteredApplications, message: "Applications by client ID" });
    } catch (error) {
        console.error('Error fetching applications:', error.message);
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
