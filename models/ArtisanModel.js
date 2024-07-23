const mongoose = require('mongoose');

const ArtisanSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    codePostal: {
        type: String,
        required: false,
        default: '225'
    },
    gender: {
        type: Object,
        default: 'Male'
    },
    dateOfBirth: {
        type: Date
    },
    profilePicture: {
        type: String
    },
    profession: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['Client', 'Artisan'],
        required: false
    },
    description: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    services: {
        type: [String],
        required: false
    },
    skills: {
        type: [String]
    },
    experienceYears: {
        type: Number
    },
    location: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        default: 0
    },
    certifications: {
        type: [String]
    },
    availability: {
        type: String,
        enum: ['Available', 'Busy', 'Unavailable'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
});

const Artisan = mongoose.model('Artisan', ArtisanSchema);

module.exports = Artisan;
