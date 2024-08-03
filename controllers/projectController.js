const Project = require('../models/ProjetcModel');
const Application = require('../models/ApplicationModel');

exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    return res.status(201).json({ data: project, message: "Projet créé avec succès" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.status(200).json({ data: projects.reverse(), message: "Tous les projets récupérés avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectsByClient = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.params.clientId });
    return res.status(200).json({ data: projects.reverse() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectsForArtisan = async (req, res) => {
  try {
    const artisanId = req.params.artisanId;
    const applications = await Application.find({ artisanId });
    const appliedProjectIds = applications.map(app => app.projectId.toString());
    const allProjects = await Project.find({});
    const appliedProjects = allProjects.filter(project => 
      appliedProjectIds.includes(project._id.toString())
    );

    return res.status(200).json({ data: appliedProjects, message: "Projets appliqués par l'artisan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    return res.status(200).json({ data: project, message: "Projet récupéré avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    return res.status(200).json({ data: project, message: "Projet mis à jour avec succès" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    return res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
