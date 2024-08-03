const Review = require('../models/ReviewModel');

exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    return res.status(201).json({ data: review, message: "Nouvel avis posté avec succès" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('clientId', 'firstname lastname phone codePostal email')
      .populate('artisanId', 'firstname lastname phone codePostal email');
    return res.status(200).json({ data: reviews.reverse(), message: "Tous les avis" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByArtisan = async (req, res) => {
  try {
    const reviews = await Review.find({ artisanId: req.params.artisanId })
      .populate('clientId', 'firstname lastname phone codePostal email')
      .populate('artisanId', 'firstname lastname phone codePostal email');
    return res.status(200).json({ data: reviews.reverse(), message: "Avis de l'artisan récupérés avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('clientId', 'firstname lastname phone codePostal email')
      .populate('artisanId', 'firstname lastname phone codePostal email');
    return res.status(200).json({ data: review, message: "Avis récupéré avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }
    return res.status(200).json({ data: review, message: "Avis mis à jour" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.hideReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { access: false }, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }
    return res.status(200).json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.restoreReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { access: true }, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }
    return res.status(200).json({ message: 'Avis restauré avec succès' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
