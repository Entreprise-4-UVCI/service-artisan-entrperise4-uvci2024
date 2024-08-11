const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
});

const quoteSchema = new mongoose.Schema({
    title: { type: String, required: false },
    clientName: { type: String, required: false},
    clientEmail: { type: String, required: false },
    clientPhone: { type: String },
    items: [itemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    artisanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
        required: false
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
        required: false
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
