const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan', // Référence au modèle User (peut être Artisan ou Client)
    required: false
  },
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan', // Référence à l'artisan qui reçoit le paiement
    required: false
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment', // Référence au modèle Payment associé
    required: false
  },
  amount: {
    type: Number,
    required: false
  },
  currency: {
    type: String,
    default: 'CFA',
    required: false
  },
  transactionType: {
    type: String,
    enum: ['SERVICE_PAYMENT', 'DONATION', 'SUBSCRIPTION', 'OTHER'],
    required: true,
    default:"SERVICE_PAYMENT"
  },
  transactionStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
    required: false
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
