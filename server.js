require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Routers
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API routes (delegated to routers/controllers)
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (centralized)
const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);

// Start server after DB connection and seeding
const seedProducts = require('./seed/seedProducts');

db.connectDB().then(async () => {
  await seedProducts();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
