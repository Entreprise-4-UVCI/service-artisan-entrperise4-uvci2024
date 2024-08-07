const Review = require('../models/ReviewModel');

exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    return res.status(201).json({ data: review, message: "Nouvel avis posté avec succès" });
  } catch (error) {
    console.log(error.message)
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('clientId', 'firstname lastname phone codePostal email profilePicture')
      .populate('artisanId', 'firstname lastname phone codePostal email profilePicture');
    return res.status(200).json({ data: reviews.reverse(), message: "Tous les avis" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByClient = async (req, res) => {
  try {
    const reviews = await Review.find({ clientId: req.params.artisanId })
      .populate('clientId', 'firstname lastname phone codePostal email profilePicture')
      .populate('artisanId', 'firstname lastname phone codePostal email profilePicture');
    return res.status(200).json({ data: reviews.reverse(), message: "Avis de l'artisan récupérés avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.getReviewsByArtisanView = async (req, res) => {
  try {
    const reviews = await Review.find({ artisanId: req.params.artisanId })
      .populate('clientId', 'firstname lastname phone codePostal email profilePicture')
      .populate('artisanId', 'firstname lastname phone codePostal email profilePicture');
    return res.status(200).json({ data: reviews.reverse(), message: "Avis de l'artisan récupérés avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('clientId', 'firstname lastname phone codePostal email profilePicture')
      .populate('artisanId', 'firstname lastname phone codePostal email profilePicture');
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
