const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadFields = upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 }
]);

router.get('/:id/image/:type', bookController.getBookImage);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/bulk', bookController.createMultipleBooks);
router.post('/', uploadFields, bookController.createBook);
router.put('/:id', uploadFields, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
