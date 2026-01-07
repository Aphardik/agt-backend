const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:orderId/books/:bookId/status', orderController.updateOrderedBookStatus);
router.get('/reader/:readerId', orderController.getOrdersByReader);
router.get('/book/:bookId/stats', orderController.getBookOrderStats);
router.get('/book/:bookId/orders', orderController.getOrdersByBook);

module.exports = router;
