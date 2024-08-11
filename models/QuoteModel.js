const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
});

const quoteSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String },
    items: [itemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    artisan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
