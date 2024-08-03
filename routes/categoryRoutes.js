const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateToken = require('../middlewares/auth');

router.post('/register', authenticateToken, categoryController.createCategory);
router.get('/get_categorys', categoryController.getAllCategories);
router.get('/get_category/:id', categoryController.getCategoryById);
router.patch('/edit/:id', authenticateToken, categoryController.updateCategory);
router.put('/hide/:id', authenticateToken, categoryController.hideCategory);
router.put('/remove/:id', authenticateToken, categoryController.restoreCategory);

module.exports = router;
