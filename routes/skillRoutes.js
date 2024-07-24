const express = require('express');
const router = express.Router();
const Skill = require('../models/SkillModel');
const authenticateToken = require('../middlewares/auth');

// Créer un nouvel avis
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json({ data: skill, message: "Nouvelle compétences  avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtenir tous les avis
router.get('/get_skills', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json({ data: skills, message: "Tous les avis" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les avis d'un artisan
router.get('/get_skills/artisan/:artisanId', async (req, res) => {
    try {
        const skills = await Skill.find({ artisanId: req.params.artisanId });
        res.status(200).json({ data: skills, message: "Compétences d'un artisan récupérés avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Obtenir un avis spécifique
router.get('/get_skill/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        res.status(200).json({ data: skill, message: "Compétences récupéré avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un avis
router.patch('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!skill) {
            return res.status(404).json({ message: 'Compétence non trouvé' });
        }
        res.status(200).json({ data: skill, message: "Compétence mis à jour" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un avis (mettre à jour pour le cacher)
router.put('/hide/:id', authenticateToken, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, { access: false }, { new: true });
        if (!skill) {
            return res.status(404).json({ message: 'Compétence non trouvé' });
        }
        res.status(200).json({ message: 'Compétence supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Restaurer un avis
router.put('/remove/:id', authenticateToken, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, { access: true }, { new: true });
        if (!skill) {
            return res.status(404).json({ message: 'Compétence non trouvé' });
        }
        res.status(200).json({ message: 'Compétence restauré avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;



