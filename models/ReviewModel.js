const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },
    artisanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 1
    },
    comment: {
        type: String,
        required: true
    },
    access: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
