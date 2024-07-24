const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: false
});

const Skill = mongoose.model('Skill', SkillSchema);




const createSkillsDefault = async (item) => {
    const newadmin = new Skill({
        name: item,
    });
    await newadmin.save()
        .then((savedAdmin) => {
            console.log(` ${item} Créer avec succès `);
        })
        .catch((error) => {
            console.log(`Compétences ${item} existe déja`);
        });
}

const skillsList = [
    "Coiffure homme et femme",
    "Mécanique automobile",
    "Entraînement sportif personnel",
    "Cuisine de rue",
    "Couture sur mesure",
    "Fabrication de meubles",
    "Sculpture sur bois",
    "Création de bijoux",
    "Maçonnerie générale",
    "Plomberie sanitaire",
    "Menuiserie en bâtiment",
    "Installation électrique",
    "Peinture de bâtiment",
    "Pose de carrelage",
    "Service de nettoyage",
    "Aménagement de jardin",
    "Sécurité privée",
    "Gardiennage résidentiel",
    "Réparation de téléphones",
    "Transport de marchandises",
    "Service moto-taxi",
    "Formation professionnelle",
    "Cours particuliers",
    "Vente ambulante",
    "Restauration rapide",
    "Marché de légumes",
    "Marché de fruits",
    "Vente de boissons",
    "Soudure à l'arc",
    "Cordonnier traditionnel",
    "Tapissier d'ameublement",
    "Tissage de pagnes",
    "Chauffeur privé",
    "Service de livraison",
    "Serrurerie d'urgence",
    "Réparation électronique",
    "Réparation informatique",
    "Service de photographie",
    "Vidéo de mariage",
    "Maquillage professionnel",
    "Manucure et pédicure",
    "Soins esthétiques",
    "Décoration intérieure",
    "Travaux de bricolage",
    "Vérification technique",
    "Entretien de véhicules",
    "Installation de climatisation",
    "Maintenance de machines",
    "Assemblage de meubles",
    "Culture maraîchère",
    "Récolte de fruits",
    "Pêche artisanale",
    "Élevage de poulets",
    "Transformation alimentaire",
    "Production de savon",
    "Conception graphique",
    "Design de mode",
    "Impression de t-shirts",
    "Sérigraphie textile",
    "Graphisme publicitaire",
    "Stratégie de marketing",
    "Communication digitale",
    "Promotion des ventes",
    "Gestion d'entreprise",
    "Comptabilité de base",
    "Conseils financiers",
    "Consultation en santé",
    "Coaching personnel",
    "Soins médicaux",
    "Pharmacie de rue",
    "Soins vétérinaires",
    "Assistance sociale",
    "Garde d'enfants",
    "Éducation informelle",
    "Animation pour enfants",
    "Organisation de tournois",
    "Réparation de motos",
    "Réparation de vélos",
    "Nettoyage de bureaux",
    "Nettoyage de maisons",
    "Fabrication de pain",
    "Vente de vêtements",
    "Réparation de chaussures",
    "Création de sites web",
    "Développement d'applications",
    "Support technique",
    "Installation de réseaux",
    "Maintenance informatique",
    "Installation de logiciels",
    "Formation informatique",
    "Consultation juridique",
    "Services de traduction",
    "Organisation d'événements",
    "Planification de mariage",
    "Couture de vêtements",
    "Fabrication de bijoux",
    "Entretien de jardins",
    "Peinture artistique",
    "Photographie événementielle",
    "Vente de produits artisanaux",
    "Fabrication de jouets",
    "Création de décorations",
    "Service de déménagement",
    "Réparation d'appareils électroménagers"
];

// skills
for (var item of skillsList) {
    createSkillsDefault(item);
}


module.exports = Skill;
