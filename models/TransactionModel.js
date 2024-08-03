const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan', // Référence au modèle User (peut être Artisan ou Client)
    required: true
  },
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan', // Référence à l'artisan qui reçoit le paiement
    required: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment', // Référence au modèle Payment associé
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'CFA',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['SERVICE_PAYMENT', 'DONATION', 'SUBSCRIPTION', 'OTHER'],
    required: true
  },
  transactionStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
