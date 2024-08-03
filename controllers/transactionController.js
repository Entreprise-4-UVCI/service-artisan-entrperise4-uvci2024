const Transaction = require('../models/TransactionModel');

// Créer une transaction
exports.createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).json({ data: transaction, message: "Transaction créée avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir une transaction par ID
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction non trouvée' });
        }
        res.json({ data: transaction, message: "Transaction récupérée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir toutes les transactions d'un utilisateur
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId });
        res.json({ data: transactions, message: "Transactions récupérées avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction non trouvée' });
        }
        res.json({ data: transaction, message: "Transaction mise à jour avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction non trouvée' });
        }
        res.json({ message: 'Transaction supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
