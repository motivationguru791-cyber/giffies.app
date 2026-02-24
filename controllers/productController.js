// controllers/productController.js
// Uses Mongoose Product model. If no DB is present yet, seedProducts will
// populate the collection when server starts.

const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description
    })));
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).lean();
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to load product' });
  }
};

