const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller.js');
const upload = require('../config/multer');

const uploadFields = upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 }
]);

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/bulk', upload.any(), bookController.createMultipleBooks);
router.post('/', uploadFields, bookController.createBook);
router.put('/:id', uploadFields, bookController.updateBook);
router.delete('/bulk-delete', bookController.deleteBooks);
router.delete('/:id', bookController.deleteBook);


module.exports = router;