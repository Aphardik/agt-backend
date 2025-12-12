const express = require('express');
const router = express.Router();
const masterController = require('../controllers/master.controller');

// Language Routes
router.get('/languages', masterController.getAllLanguages);
router.post('/languages', masterController.createLanguage);

// Category Routes
router.get('/categories', masterController.getAllCategories);
router.post('/categories', masterController.createCategory);

module.exports = router;
