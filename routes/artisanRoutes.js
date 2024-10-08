const express = require('express');
const router = express.Router();
const artisanController = require('../controllers/artisanController');
const authenticateToken = require('../middlewares/auth');

router.post('/register-artisan', artisanController.registerArtisan);
router.post('/register-client', artisanController.registerClient);
router.post('/login', artisanController.login);
router.post('/update-password/:id',artisanController.updatePassworArtisan);
router.post('/account-recharge-solde/:id',artisanController.AccountArtisan);
router.post('/reset-password',artisanController.resetPassworArtisan);
router.post('/send-code-verify',artisanController.senCodeResetArtisan);
router.post('/verfiy-code-reset',artisanController.verifyCodeArtisan);
router.put('/edit/:id', artisanController.updateArtisan);
router.patch('/block/:id', authenticateToken, artisanController.blockArtisan);
router.get('/get_artisans', artisanController.getAllArtisans);
router.get('/get_artisans/city/:idcity', artisanController.getAllArtisansByCity);
router.get('/get_clients', artisanController.getAllClients);
router.get('/get_artisan/:id', artisanController.getArtisanById);
router.get('/get_projet/:id/projects', authenticateToken, artisanController.getProjectsByArtisan);

module.exports = router;
