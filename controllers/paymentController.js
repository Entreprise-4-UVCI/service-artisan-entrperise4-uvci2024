const Payment = require('../models/PaymentModel');

// Créer un paiement
exports.createPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json({ data: payment, message: "Paiement créé avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir un paiement par ID
exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Paiement non trouvé' });
        }
        res.json({ data: payment, message: "Paiement récupéré avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir tous les paiements d'un artisan
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ artisanId: req.params.artisanId });
        res.json({ data: payments, message: "Paiements récupérés avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un paiement
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) {
            return res.status(404).json({ message: 'Paiement non trouvé' });
        }
        res.json({ data: payment, message: "Paiement mis à jour avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un paiement
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Paiement non trouvé' });
        }
        res.json({ message: 'Paiement supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
