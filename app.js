const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();
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
const authenticateToken = require('./middlewares/auth');

app.use("/", authenticateToken, async (req, res) => {
    res.json({ message: "Api Artisan web availability" });
})

// Utilisation des routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/application', applicationRoutes);
app.use('/api/v1/review', reviewRoutes);

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync({ force: true }).then(() => {
    console.log('Base de donné créer avec succès!');
    app.listen(port, () => {
        console.log(`Demarage du serveur ${port}`);
    });
}).catch(error => {
    console.error('Impossible de conencter la base de données:', error);
});




