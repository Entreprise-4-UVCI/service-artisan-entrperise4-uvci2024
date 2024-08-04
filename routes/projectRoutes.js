const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middlewares/auth');

router.post('/register', projectController.createProject);
router.get('/get_projects', projectController.getAllProjects);
router.get('/get_projects/client/:clientId', projectController.getProjectsByClient);
router.get('/get_projects_for_artisan/:artisanId', projectController.getProjectsForArtisan);
router.get('/get_project/:id', projectController.getProjectById);
router.put('/edit/:id', projectController.updateProject);
router.delete('/delete/:id', projectController.deleteProject);

module.exports = router;
