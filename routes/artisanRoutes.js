const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Artisan = require('../models/ArtisanModel');
const Project = require('../models/ProjetcModel');
const authenticateToken = require('../middlewares/auth');
const Application = require('../models/ApplicationModel');
const sendEmail = require('../utils/sendEmail');

const generatePassword = (length) => {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// Créer un nouvel artisan
router.post('/register-artisan', async (req, res) => {



    try {

        const { email, firstname, lastname, phone, address, gender, dateOfBirth, profilePicture, profession, description, services, skills, experienceYears, location, certifications } = req.body;
        const password = generatePassword(10);
        const hashedPassword = await bcrypt.hash(password, 10);

        const artisanExist = await Artisan.findOne({ email: req.body.email, phone: req.body.phone });
        if (artisanExist) {
            return res.status(402).json({ message: "Artisan existe déja" })
        }

        const artisan = new Artisan({
            firstname, lastname, email, phone, address, role: 'Artisan', gender, dateOfBirth, profilePicture,
            profession, description, services, skills, experienceYears, location, certifications, password: hashedPassword
        });


        await artisan.save();
        sendEmail(
            "aymarbly559@gmail.com",
            "a g c t x y x c o x s k v a g k",
            `${artisan.email}`,
            "Mot de passe Plateforme artisan",
            `Votre mot de passe  est : <strong style="size:40px;">${password}</strong>`
        );

        const token = jwt.sign({ id: artisan._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        return res.status(201).json({ data: artisan, token: token, message: "Artisan créé avec succès" });


    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
        
    }
});

router.post('/register-client', async (req, res) => {

    try {

        const { email, firstname, lastname, phone, address, gender, dateOfBirth, profilePicture, profession, description, services, skills, experienceYears, location, certifications } = req.body;
        const password = generatePassword(10);
        const hashedPassword = await bcrypt.hash(password, 10);

        const artisanExist = await Artisan.findOne({ email: req.body.email, phone: req.body.phone });
        if (artisanExist) {
            return res.status(402).json({ message: "Artisan existe déja" })
        }


        const artisan = new Artisan({
            firstname, lastname, email, password: hashedPassword, phone, address, role: 'Client', gender, dateOfBirth, profilePicture,
            profession, description, services, skills, experienceYears, location, certifications
        });
        await artisan.save();
        sendEmail(
            "aymarbly559@gmail.com",
            "a g c t x y x c o x s k v a g k",
            `${artisan.email}`,
            "Mot de passe Plateforme artisan",
            `Votre mot de passe  est : <strong style="size:40px;">${password}</strong>`
        );

        const token = jwt.sign({ id: artisan._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        return res.status(201).json({ data: artisan, token: token, message: "Client créé avec succès" });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
    }
});

// Connexion de l'artisan
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Artisan.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Artisan non trouvé' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Mot de passe non valide "+req.body.password)
            return res.status(400).json({ message: 'Mot de passe non valide' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        res.json({ data: user, token: token, message: "Connexion réussie" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
// Mettre à jour les informations de l'artisan
router.put('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        delete updates.password;
        delete updates.access;

        console.log(`ID à mettre à jour: ${id}`);
        console.log('Données de mise à jour:', updates);

        const userExist = await Artisan.findById({_id:id});
        if (!userExist) {
            return res.status(404).json({ message: "Cet utilisateur est introuvable" });
        }

        // Mise à jour de l'utilisateur
        const result = await Artisan.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!result) {
            return res.status(404).json({ message: "Mise à jour échouée, utilisateur non trouvé" });
        }

        console.log('Utilisateur mis à jour:', result);

        return res.status(200).json({ data: result, message: "Mise à jour réussie" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error.message);
        return res.status(400).json({ message: error.message });
    }
});


// Bloquer ou débloquer un compte d'artisan
router.patch('/block/:id', authenticateToken, async (req, res) => {
    try {
        const user = await Artisan.findById(req.params.id);
        if (!user || user.role !== 'Artisan') {
            return res.status(404).json({ error: 'Artisan non trouvé' });
        }
        user.status = user.status === 'Blocked' ? 'Active' : 'Blocked';
        await user.save();
        res.json({ data: user, message: `Utilisateur ${user.status.toLowerCase()}` });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Obtenir tous les artisans
router.get('/get_artisans', async (req, res) => {
    try {
        const artisans = await Artisan.find({role:"Artisan"}).populate('userId');
        return res.status(200).json({ data: artisans, message: "Tous les artisans" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// Obtenir tous les artisans
router.get('/get_clients', async (req, res) => {
    try {
        const artisans = await Artisan.find({role:"Client"}).populate('userId');
        return res.status(200).json({ data: artisans, message: "Tous les artisans" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Obtenir les détails d'un artisan spécifique
router.get('/get_artisan/:id', async (req, res) => {
    try {
        const artisan = await Artisan.findById(req.params.id).populate('userId');
        if (!artisan) {
            return res.status(404).send({ error: 'Artisan non trouvé' });
        }
        return res.status(200).json({ data: artisan, message: "Artisan récupéré avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Obtenir les candidature d'un artisan
router.get('/get_projet/:id/projects', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.find({ artisanId: req.params.id }).populate('projectId,title');
        return res.status(200).json({ data: applications, message: "Projets de l'artisan récupérés avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

module.exports = router;
