const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Artisan = require('../models/ArtisanModel');
const sendEmail = require('../utils/sendEmail');
const dotenv = require('dotenv');
dotenv.config();

const generatePassword = (length) => {
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

exports.registerArtisan = async (req, res) => {
  try {
    const { email, firstname, lastname, phone, address, gender, dateOfBirth, profilePicture, profession, description, services, skills, experienceYears, location, certifications } = req.body;
    const password = generatePassword(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const artisanExist = await Artisan.findOne({ email, phone });
    if (artisanExist) {
      return res.status(402).json({ message: "Artisan existe déjà" });
    }

    const artisan = new Artisan({
      firstname, lastname, email, phone, address, role: 'Artisan', gender, dateOfBirth, profilePicture,
      profession, description, services, skills, experienceYears, location, certifications, password: hashedPassword
    });

    await artisan.save();
    sendEmail(
      "aymarbly559@gmail.com",
      "a g c t x y x c o x s k v a g k",
      artisan.email,
      "Mot de passe Plateforme Artisan",
      `Votre mot de passe est : <strong>${password}</strong>`
    );

    const token = jwt.sign({ id: artisan._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
    return res.status(201).json({ data: artisan, token, message: "Artisan créé avec succès" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

exports.registerClient = async (req, res) => {
  try {
    const { email, firstname, lastname, phone, address, gender, dateOfBirth, profilePicture, profession, description, services, skills, experienceYears, location, certifications } = req.body;
    const password = generatePassword(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const clientExist = await Artisan.findOne({ email, phone });
    if (clientExist) {
      return res.status(402).json({ message: "Client existe déjà" });
    }

    const client = new Artisan({
      firstname, lastname, email, password: hashedPassword, phone, address, role: 'Client', gender, dateOfBirth, profilePicture,
      profession, description, services, skills, experienceYears, location, certifications
    });

    await client.save();
    sendEmail(
      "noreply@example.com",
      "Votre mot de passe",
      client.email,
      "Mot de passe Plateforme Artisan",
      `Votre mot de passe est : <strong>${password}</strong>`
    );

    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
    return res.status(201).json({ data: client, token, message: "Client créé avec succès" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Artisan.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe non valide' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
    res.json({ data: user, token, message: "Connexion réussie" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateArtisan = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    delete updates.password;
    delete updates.access;

    const userExist = await Artisan.findById({ _id: id });
    if (!userExist) {
      return res.status(404).json({ message: "Cet utilisateur est introuvable" });
    }

    const result = await Artisan.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!result) {
      return res.status(404).json({ message: "Mise à jour échouée, utilisateur non trouvé" });
    }

    return res.status(200).json({ data: result, message: "Mise à jour réussie" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.blockArtisan = async (req, res) => {
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
};

exports.getAllArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.find({ role: "Artisan" }).populate('userId');
    return res.status(200).json({ data: artisans, message: "Tous les artisans" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Artisan.find({ role: "Client" }).populate('userId');
    return res.status(200).json({ data: clients, message: "Tous les clients" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getArtisanById = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id).populate('userId');
    if (!artisan) {
      return res.status(404).send({ error: 'Artisan non trouvé' });
    }
    return res.status(200).json({ data: artisan, message: "Artisan récupéré avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectsByArtisan = async (req, res) => {
  try {
    const applications = await Application.find({ artisanId: req.params.id }).populate('projectId', 'title');
    return res.status(200).json({ data: applications, message: "Projets de l'artisan récupérés avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
