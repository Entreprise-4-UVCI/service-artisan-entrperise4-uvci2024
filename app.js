const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const sequelize = require('./database');
const models = require('./models');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import des routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reviews', reviewRoutes);

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync({ force: true }).then(() => {
    console.log('Base de donné créer avec succès!');
    app.listen(port, () => {
        console.log(`Demarage du serveur ${port}`);
    });
}).catch(error => {
    console.error('Impossible de conencter la base de données:', error);
});
