const Category = require('../models/CategoryModel');

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    return res.status(201).json({ data: category, message: "Nouvelle catégorie créée avec succès" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ data: categories, message: "Toutes les catégories récupérées avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    return res.status(200).json({ data: category, message: "Catégorie récupérée avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    return res.status(200).json({ data: category, message: "Catégorie mise à jour avec succès" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.hideCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { access: false }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    return res.status(200).json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.restoreCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { access: true }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    return res.status(200).json({ message: 'Catégorie restaurée avec succès' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
