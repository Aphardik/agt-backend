const express = require('express');
const router = express.Router();
const readerController = require('../controllers/reader.controller');

router.get('/', readerController.getAllReaders);
router.get('/:id', readerController.getReaderById);
router.post('/', readerController.createReader);
router.put('/:id', readerController.updateReader);
router.delete('/:id', readerController.deleteReader);

module.exports = router;
