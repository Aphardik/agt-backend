const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);
router.get('/reader/:readerId', orderController.getOrdersByReader);
router.get('/book/:bookId/stats', orderController.getBookOrderStats);

module.exports = router;
