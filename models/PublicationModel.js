const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type:Object
  },
  coutDay:{
    type:Number,
    default:1
  },
  image: {
    type: String, // URL de l'image associée à la publication
    required: false
  },
  budgetChoice: {
    type: Number,
    default:1000
  },
  datePublished: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artisan',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    dateCommented: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Publication', PublicationSchema);
