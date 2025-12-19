const express = require('express');
const router = express.Router();
const masterController = require('../controllers/master.controller');

// Language Routes
router.get('/languages', masterController.getAllLanguages);
router.post('/languages', masterController.createLanguage);
router.delete('/languages/:id', masterController.deleteLanguage);
router.put('/languages/:id', masterController.updateLanguage);

// Category Routes
router.get('/categories', masterController.getAllCategories);
router.post('/categories', masterController.createCategory);
router.delete('/categories/:id', masterController.deleteCategory);
router.put('/categories/:id', masterController.updateCategory);

module.exports = router;
