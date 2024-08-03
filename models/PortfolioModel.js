const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan', // Référence au modèle Artisan
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String], // URLs des images des projets
    required: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String], // Mots-clés pour décrire le projet
    required: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
