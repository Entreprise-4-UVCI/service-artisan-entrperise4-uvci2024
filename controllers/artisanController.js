const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Artisan = require('../models/ArtisanModel');
const sendEmail = require('../utils/sendEmail');
const dotenv = require('dotenv');
const ApplicationInfo = require('../utils/dataApi');
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



function generateRandomPasswordE(length) {
  const charset = "0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}






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

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mot de passe Plateforme Artisan</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${ApplicationInfo.logoWebSite}" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
                <h2 style="color: #333;">Bienvenue sur ${ApplicationInfo.name}</h2>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <h3>Votre mot de passe est :</h3>
                <p style="font-size: 24px; font-weight: bold; color: #555;">${password}</p>
                <a href="${ApplicationInfo.urlwebSite}/connexion" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Accéder à l'application</a>
            </div>
            <p style="color: #666; margin-top: 20px;"></p>
            <p style="color: #666;">Cordialement,<br>L'équipe ${ApplicationInfo.name}</p>
        </div>
    </body>
    </html>
`;



    sendEmail(
      `${ApplicationInfo.emailApplication}`,
      `${ApplicationInfo.passwordEmail}`,
      artisan.email,
      "Mot de passe Plateforme Artisan",
      `${htmlContent}`
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


    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mot de passe Plateforme Artisan</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${ApplicationInfo.logoWebSite}" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
                <h2 style="color: #333;">Bienvenue sur ${ApplicationInfo.name}</h2>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <h3>Votre mot de passe est :</h3>
                <p style="font-size: 24px; font-weight: bold; color: #555;">${password}</p>
                <a href="${ApplicationInfo.urlwebSite}/connexion" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Accéder à l'application</a>
            </div>
            <p style="color: #666; margin-top: 20px;"></p>
            <p style="color: #666;">Cordialement,<br>L'équipe ${ApplicationInfo.name}</p>
        </div>
    </body>
    </html>
`;


    sendEmail(
      `${ApplicationInfo.emailApplication}`,
      `${ApplicationInfo.passwordEmail}`,
      client.email,
      `Mot de passe de connexion ${ApplicationInfo.email}`,
      `${htmlContent}`
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
    return res.status(200).json({ data: artisans.reverse(), message: "Tous les artisans" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



exports.getAllArtisansByCity = async (req, res) => {
  try {
    const artisans = await Artisan.find({ role: "Artisan","city.value":req.params.idcity }).populate('userId');
    // console.log(artisans.reverse());
    return res.status(200).json({ data: artisans.reverse(), message: "Tous les artisans" });
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




// update passwor artisan
// reste artisan
exports.updatePassworArtisan = async (req, res) => {
  try {
    const { password } = req.body;
    const idUser = req.params.id;
    const artisanExist = await Artisan.findById({ _id: idUser });
    if (!artisanExist) {
      return res.status(410).json({ message: `Cet artisan n'esiste pas` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    artisanExist.password = hashedPassword;

    /*sendEmail(
        `${ApplicationInfo.emailApplication}`,
      `${ApplicationInfo.passwordEmail}`,
        `${newUser.email}`,
        `${ApplicationInfo.name} Mise a jour de mot de passe`,
        `Votre mot viens d'etre mis à jour `
    );*/

    await artisanExist.save();

    return res.status(200).json({ data: artisanExist, message: "Mise a jour de votre mot de passe effectuer avec succès" });

  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
}







// reste artisan
exports.resetPassworArtisan = async (req, res) => {
  try {
    const { password, email, phone, _id } = req.body;
    const idUser = req.params.id;
    const artisanExist = await Artisan.findOne({ $or: [{ _id: _id }, { email: email }, { phone: phone }] });
    if (!artisanExist) {
      return res.status(410).json({ message: `Cet artisan n'esiste pas` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    artisanExist.password = hashedPassword;

    /*sendEmail(
        "aymarbly559@gmail.com",
        "a g c t x y x c o x s k v a g k",
        `${newUser.email}`,
        `${ApplicationInfo.name} Mise a jour de mot de passe`,
        `Votre mot viens d'etre mis à jour `
    );*/

    await artisanExist.save();

    return res.status(200).json({ data: artisanExist, message: "Mise a jour de votre mot de passe effectuer avec succès" });

  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
}







//send code artisan
exports.senCodeResetArtisan = async (req, res) => {
  try {
    const { phone, email } = req.body;
    console.log(email,phone)
    const artisanExist = await Artisan.findOne({ $or: [{ phone: phone }, { email: email }] });
    if (!artisanExist) {
      return res.status(410).json({ message: `Cet artisan n'esiste pas avec cet compte` });
    }
    const codeRandom = generateRandomPasswordE(4);

    artisanExist.passwordverifield = codeRandom;
    await artisanExist.save();

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mot de passe Plateforme Artisan</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${ApplicationInfo.logoWebSite}" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
                <h2 style="color: #333;">Code de verification envoyé par ${ApplicationInfo.name}</h2>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <h3>Votre code verfication est :</h3>
                <p style="font-size: 24px; font-weight: bold; color: #555;">${codeRandom}</p>
                <a href="${ApplicationInfo.urlwebSite}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Accéder à l'application</a>
            </div>
            <p style="color: #666; margin-top: 20px;">Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail.</p>
            <p style="color: #666;">Cordialement,<br>L'équipe ${ApplicationInfo.name}</p>
        </div>
    </body>
    </html>
`;



    sendEmail(
      `${ApplicationInfo.emailApplication}`,
      `${ApplicationInfo.passwordEmail}`,
      `${artisanExist.email}`,
      `${ApplicationInfo.name} à envoyer un code vérification`,
      `${htmlContent}`
    );

   

    return res.status(200).json({ data: artisanExist, message: "Mise a jour de votre mot de passe effectuer avec succès" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
}




// verify code 
exports.verifyCodeArtisan = async (req, res) => {
  try {
    const { phone, email, passwordverifield } = req.body;
    const artisanExist = await Artisan.findOne({ $or: [{ phone: phone }, { email: email }] });
    if (!artisanExist) {
      return res.status(410).json({ message: `Cet utilisateur n'existe pas avec cet compte` });
    }
    if (!artisanExist && artisanExist.passwordverifield && artisanExist.passwordverifield == passwordverifield) {
      return res.status(411).json({ message: "Ce code n'existe pas dans notre lase base données" });
    }


    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mot de passe Plateforme Artisan</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${ApplicationInfo.logoWebSite}" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
                <h2 style="color: #333;"> ${ApplicationInfo.name} à appruvé le code de verfication </h2>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <h3>Votre code verfication est :</h3>
                <p style="font-size: 24px; font-weight: bold; color: #555;"></p>
                <a href="${ApplicationInfo.urlwebSite}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Accéder à l'application</a>
            </div>
            <p style="color: #666; margin-top: 20px;">Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail.</p>
            <p style="color: #666;">Cordialement,<br>L'équipe ${ApplicationInfo.name}</p>
        </div>
    </body>
    </html>
`;



    sendEmail(
      `${ApplicationInfo.emailApplication}`,
      `${ApplicationInfo.passwordEmail}`,
      `${artisanExist.email}`,
      `${ApplicationInfo.name} à accepter votre code vérification`,
      `${htmlContent}`
    );

    return res.status(200).json({ data: artisanExist, message: "Mise a jour de votre mot de passe effectuer avec succès" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
}



