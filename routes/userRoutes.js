const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const sendEmail = require('../utils/sendEmail');
const authenticateToken = require('../middlewares/auth');

// Créer un nouvel utilisateur
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({ name, email, password: hashedPassword, phone, address, role });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Envoyer l'e-mail avec le mot de passe généré
        await sendEmail(email, 'Bienvenue sur la plateforme', `Ton mot de passe est le suivant : <strong>${password}</strong>`);

        res.status(201).json({ data: user, token: token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Connexion de l'utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe invalide' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        res.status(200).json({ data: user, token: token, message: "Utilisateur connecté" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour les informations de l'utilisateur
router.patch('/update', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send({ error: 'Compte inexistant' });
        }
        res.status(200).json({ data: user, message: "Mise à jour du compte réussie" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un utilisateur
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).send({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
