const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateToken = require('../middlewares/auth');

router.post('/register', categoryController.createCategory);
router.get('/get_categorys', categoryController.getAllCategories);
router.get('/get_category/:id', categoryController.getCategoryById);
router.patch('/edit/:id', categoryController.updateCategory);
router.put('/hide/:id', categoryController.hideCategory);
router.put('/remove/:id', categoryController.restoreCategory);

module.exports = router;
