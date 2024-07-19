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
        const user = await User.create({ name, email, password: hashedPassword, phone, address, role });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Envoyer l'e-mail avec le mot de passe généré
        await sendEmail(email, 'Bienvenu sur la plateforme', `Tom mot de passe est le : <strong style="height:50px;width:50px"> ${password} <strong>`);

        res.status(201).json({ data:user, token:token });
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Connexion de l'utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'utilisateur non trouvé' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe invalide' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        res.status(200).json({ data:user, token:token, messsage:"utilisateur connecté" });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

// Mettre à jour les informations de l'utilisateur
router.patch('/update', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).send({ error: 'Compte inexsistant' });
        }
        await user.update(req.body);
        res.status(200).json({data:user,message :"Mise à jour du compte réussi"});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Supprimer un utilisateur
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).send({ error: 'Utilisateur non  trouvé' });
        }

        await user.destroy();
        res.status(200).json({ message: 'utilisateur supprimer' });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

module.exports = router;
