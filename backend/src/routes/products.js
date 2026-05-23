const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET all products with filters
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, color, storage, year, sort, page = 1, limit = 12, featured, isNew } = req.query;
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (year) filter.year = Number(year);
    if (featured === 'true') filter.featured = true;
    if (isNew === 'true') filter.isNewProduct = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (color) filter['colors.name'] = { $regex: color, $options: 'i' };
    if (storage) filter['storage.size'] = storage;

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'newest') sortObj = { year: -1, createdAt: -1 };
    if (sort === 'name') sortObj = { name: 1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-reviews');

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ message: 'Товар не найден' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Вы уже оставили отзыв' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Отзыв добавлен' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Create product
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Update product
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Товар не найден' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Delete product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Товар удалён' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET categories/filters metadata
router.get('/meta/filters', async (req, res) => {
  try {
    const years = await Product.distinct('year');
    const categories = await Product.distinct('category');
    const colors = await Product.distinct('colors.name');
    const storages = await Product.distinct('storage.size');
    const priceRange = await Product.aggregate([
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
    ]);
    res.json({ years: years.sort(), categories, colors, storages, priceRange: priceRange[0] || { min: 0, max: 200000 } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
