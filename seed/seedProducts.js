const Product = require('../models/Product');

async function seedProducts() {
  try {
    // Always delete old products and reseed
    await Product.deleteMany({});
    console.log('Seeding products...');
    const seed = [
      { name: 'Cozy Candle Set', price: 24.0, image: '/images/candles.jpg', description: 'Soft-scented candle set to create warm moments.' },
      { name: 'Silk Sleep Mask', price: 18.0, image: '/images/silk-mask.jpg', description: 'Lightweight silk mask for restful sleep.' },
      { name: 'Handmade Mug', price: 32.0, image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800&q=80&auto=format&fit=crop', description: 'Ceramic mug crafted for everyday comfort.' },
      { name: 'Mini Plant', price: 14.5, image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80&auto=format&fit=crop', description: 'A tiny green companion for any desk.' }
    ];
    await Product.insertMany(seed);
    console.log('Seed complete');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

module.exports = seedProducts;
