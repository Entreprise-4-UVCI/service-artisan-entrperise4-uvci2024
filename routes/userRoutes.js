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
        await sendEmail(email, 'Welcome to Our Platform', `Your password is: ${password}`);

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Connexion de l'utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ error: 'User non trouvé' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Mot de passe invalid' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        res.json({ data:user, token:token, messsage:"utilisateur connecté" });
    } catch (error) {
        res.status(500).json({error});
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
        res.json({data:user,message :"Mise ajour du compté réussi"});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// Supprimer un utilisateur
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        await user.destroy();
        res.send({ message: 'User deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
