const Publication = require('../models/PublicationModel');

// Créer une publication
exports.createPublication = async (req, res) => {
    try {
        const publication = new Publication(req.body);
        await publication.save();
        res.status(201).json({ data: publication, message: "Publication créée avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir une publication par ID
exports.getPublication = async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id);
        if (!publication) {
            return res.status(404).json({ message: 'Publication non trouvée' });
        }
        res.json({ data: publication, message: "Publication récupérée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir toutes les publications d'un artisan
exports.getAllPublications = async (req, res) => {
    try {
        const publications = await Publication.find({ artisanId: req.params.artisanId });
        res.json({ data: publications, message: "Publications récupérées avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une publication
exports.updatePublication = async (req, res) => {
    try {
        const publication = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!publication) {
            return res.status(404).json({ message: 'Publication non trouvée' });
        }
        res.json({ data: publication, message: "Publication mise à jour avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une publication
exports.deletePublication = async (req, res) => {
    try {
        const publication = await Publication.findByIdAndDelete(req.params.id);
        if (!publication) {
            return res.status(404).json({ message: 'Publication non trouvée' });
        }
        res.json({ message: 'Publication supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
