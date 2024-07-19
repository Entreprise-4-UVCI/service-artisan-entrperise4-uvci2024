const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Artisan = require('../models/ArtisanModel');
const Project = require('../models/ProjetcModel');
const Application = require('../models/ApplicationModel');
const authenticateToken = require('../middlewares/auth');

// Créer un nouvel artisan
router.post('/register', async (req, res) => {
    const { email, firstname, lastname, password, phone, address, gender, dateOfBirth, profilePicture, profession, description, services, skills, experienceYears, location, certifications } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ firstname, lastname, email, password: hashedPassword, phone, address, role: 'Artisan', gender, dateOfBirth, profilePicture });
        const artisan = await Artisan.create({
            userId: user.id,
            profession,
            description,
            services,
            skills,
            experienceYears,
            location,
            certifications
        });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });

        res.status(201).json({ data: user, artisan: artisan, token: token, message: "Artisan Créer avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Connexion de l'artisan
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email, role: 'Artisan' } });
        if (!user) {
            return res.status(404).json({ message: 'Artisan non trouvé' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de masse non valide' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        res.json({ data: user, token: token, message: "Connexion réussi" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour les informations de l'artisan
router.patch('/update', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user || user.role !== 'Artisan') {
            return res.status(404).send({ error: 'User non trouvé found' });
        }

        await user.update(req.body);
        const artisan = await Artisan.findOne({ where: { userId: user.id } });
        await artisan.update(req.body.artisanDetails);
        res.json({ data: user, artisan: artisan, message: "Mise ajour artisan réussi avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Bloquer ou débloquer un compte d'artisan
router.patch('/block/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user || user.role !== 'Artisan') {
            return res.status(404).json({ error: 'Artisan non trouvé' });
        }

        const newStatus = user.status === 'Blocked' ? 'Active' : 'Blocked';
        await user.update({ status: newStatus });
        res.json({ data: user, message: `User ${newStatus.toLowerCase()}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtenir tous les artisans
router.get('/get_artisans', async (req, res) => {
    try {
        const artisans = await Artisan.findAll({ include: User });
        res.status(200).json({ data: artisans, message: artisans });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Obtenir les détails d'un artisan spécifique
router.get('/get_artisan/:id', async (req, res) => {
    try {
        const artisan = await Artisan.findOne({ where: { id: req.params.id }, include: User });
        if (!artisan) {
            return res.status(404).send({ error: 'Artisan non trouvé' });
        }
        res.status(200).json({ data: artisan, message: "Artisan récupérer avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les projets d'un artisan
router.get('/get_projet/:id/projects', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.findAll({ where: { artisanId: req.params.id }, include: Project });
        res.status(200).json({ data: applications, message: "Projet de l'artisan récupérer avec succès" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});



module.exports = router;
