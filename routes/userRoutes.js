const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.patch('/update/:id', userController.updateUser);
router.delete('/delete', userController.deleteUser);

module.exports = router;


