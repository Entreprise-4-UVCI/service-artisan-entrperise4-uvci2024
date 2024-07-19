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
    const { name, email, password, phone, address, gender, dateOfBirth, profilePicture, profession, description, services, skills, experienceYears, location, certifications } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ name, email, password: hashedPassword, phone, address, role: 'Artisan', gender, dateOfBirth, profilePicture });
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
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send({ user, artisan, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Connexion de l'artisan
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email, role: 'Artisan' } });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        res.send({ user, token });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Mettre à jour les informations de l'artisan
router.patch('/update', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user || user.role !== 'Artisan') {
            return res.status(404).send({ error: 'User not found' });
        }

        await user.update(req.body);
        const artisan = await Artisan.findOne({ where: { userId: user.id } });
        await artisan.update(req.body.artisanDetails);
        res.send({ user, artisan });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Bloquer ou débloquer un compte d'artisan
router.patch('/block/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user || user.role !== 'Artisan') {
            return res.status(404).send({ error: 'User not found' });
        }

        const newStatus = user.status === 'Blocked' ? 'Active' : 'Blocked';
        await user.update({ status: newStatus });
        res.send({ user, message: `User ${newStatus.toLowerCase()}` });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtenir tous les artisans
router.get('/', async (req, res) => {
    try {
        const artisans = await Artisan.findAll({ include: User });
        res.status(200).send(artisans);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtenir les détails d'un artisan spécifique
router.get('/:id', async (req, res) => {
    try {
        const artisan = await Artisan.findOne({ where: { id: req.params.id }, include: User });
        if (!artisan) {
            return res.status(404).send({ error: 'Artisan not found' });
        }
        res.status(200).send(artisan);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtenir les projets d'un artisan
router.get('/:id/projects', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.findAll({ where: { artisanId: req.params.id }, include: Project });
        res.status(200).send(applications);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
