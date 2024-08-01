const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String
    }
}, {
    timestamps: false
});

const Category = mongoose.model('Category', CategorySchema);


const createCategoryDefault = async (item) => {
    const categoryExist = await Category.findOne({name:item});
    if(categoryExist){
        console.log(categoryExist.name+" existe déja . ");
    }
    const newCategory = new Category({
        name: item,
    });
    await newCategory.save()
        .then((savedAdmin) => {
            // console.log(`${item} Créer avec succès `);
        })
        .catch((error) => {
            // console.log(`${item}Catégorie existe déja`);
        });
}

const categoryList = [
    "Coiffure",
    "Mécanique",
    "Sport",
    "Nourriture",
    "Vêtements",
    "Meubles",
    "Textiles",
    "Maraîchère",
    "Fruits",
    "Légumes",
    "Maçonnerie",
    "Menuiserie",
    "Moto-taxi",
    "Transport",
    "Ménage",
    "Gardiennage",
    "Téléphones",
    "Véhicules",
    "Beauté",
    "Réparation",
    "Machines",
    "Vente",
    "Restauration",
    "Boissons",
    "Sculpture",
    "Bijoux",
    "Nettoyage",
    "Enseignement",
    "Formation",
    "Tournois"
];

// create administrateur
// for (var item of categoryList) {
//     createCategoryDefault(item);
// }

module.exports = Category;
