// controllers/orderController.js
// Uses Mongoose Order model to persist orders.

const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
  try {
    // Fetch only orders belonging to the authenticated user
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    console.log('Creating order...');
    console.log('req.body:', req.body);
    console.log('req.user:', req.user);

    // Validate user is authenticated
    if (!req.user || !req.user.id) {
      console.error('Authentication error: req.user.id is missing');
      return res.status(401).json({ error: 'Unauthorized - Please login first' });
    }

    const { name, email, address, items, totalAmount } = req.body;
    
    // Validation
    if (!name || !email || !address) {
      return res.status(400).json({ error: 'Missing required fields: name, email, address' });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: items array cannot be empty' });
    }
    
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid totalAmount - must be a positive number' });
    }

    // Generate orderNumber before saving
    const now = new Date();
    const year = now.getFullYear();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderNumber = `GIFF-${year}-${randomSuffix}`;

    const payload = {
      orderNumber,
      name,
      email,
      address,
      items,
      totalAmount: Number(totalAmount),
      user: req.user.id
    };

    console.log('Order payload:', payload);

    const order = await Order.create(payload);
    
    console.log('Order created successfully:', order._id);
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    const errorMessage = err.message || 'Failed to create order';
    res.status(500).json({ error: errorMessage, details: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  }
};
