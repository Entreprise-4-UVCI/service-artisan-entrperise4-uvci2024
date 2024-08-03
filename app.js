const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
dotenv.config();
const connectDB = require('./database');


const app = express();
const port = process.env.PORT || 1000;

// middlwares de l'application 
app.use(cors({ origin: "*" }));
app.use(morgan('common'));
app.use(express.json({ limit: "500mb" }));
//app.use(express.urlencoded({ limit: "500mb" }));
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({
  limit: '1000mb',
  extended: true,
}));
app.use(helmet());
// access control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST ');
  res.setHeader('Authorization', 'Bearer Sb5xnq9Gwe4mIlyucQJpi0lCoyn+faar5SRVzAFGDAqZbr6kRROW/');
  next();
})


const UploadFile = require("./utils/FileUpload");

// Import des routes
const artisanRoutes = require('./routes/artisanRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const skillRoutes = require('./routes/skillRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authenticateToken = require('./middlewares/auth');
// services artisans
const portfolioRoutes = require('./routes/portfolioRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');



// upload image
app.post("/uploadImage", (req, res) => {
  UploadFile(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});



// Route de test pour vérifier que le serveur fonctionne
app.get("/", authenticateToken, (req, res) => {
  res.json({ message: "API Artisan web availability" });
});



// Utilisation des routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/artisan', artisanRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/application', applicationRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/skill', skillRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/chat', chatRoutes);
// secvices artisans
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/publication', publicationRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/transaction', transactionRoutes);



// Connectez-vous à MongoDB et démarrez le serveur
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Démarrage du serveur sur le port ${port}`);
  });
}).catch(error => {
  console.error('Impossible de connecter la base de données:', error);
});
