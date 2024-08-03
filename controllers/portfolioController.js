const Portfolio = require('../models/PortfolioModel');

// Créer un portfolio
exports.createPortfolio = async (req, res) => {
    try {
        const portfolio = new Portfolio(req.body);
        await portfolio.save();
        res.status(201).json({ data: portfolio, message: "Portfolio créé avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir un portfolio par ID
exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio non trouvé' });
        }
        res.json({ data: portfolio, message: "Portfolio récupéré avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir tous les portfolios d'un artisan
exports.getAllPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ artisanId: req.params.artisanId,isVisible:true });
        res.json({ data: portfolios, message: "Portfolios récupérés avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un portfolio
exports.updatePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio non trouvé' });
        }
        res.json({ data: portfolio, message: "Portfolio mis à jour avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un portfolio
exports.deletePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById({_id:req.params.id});
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio non trouvé' });
        }
        portfolio.isVisible=false;
        portfolio.save();

        return res.status(200).json({ message: 'Portfolio supprimé avec succès' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
