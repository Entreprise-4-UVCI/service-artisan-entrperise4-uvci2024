const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan', // Référence au modèle User (peut être Artisan ou Client)
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'XOF', // Par exemple, pour les francs CFA
    required: false
  },
  paymentMethod: {
    type: String,
    required: false
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
    required: true
  },
  transactionId: {
    type: String,
    required: false
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
