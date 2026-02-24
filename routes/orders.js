const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/orders (protected) - fetch user's orders
router.get('/', protect, orderController.getOrders);

// POST /api/orders (protected) - create new order
router.post('/', protect, orderController.createOrder);

module.exports = router;
