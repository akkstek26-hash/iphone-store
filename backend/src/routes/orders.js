const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const PROMO_CODES = {
  'APPLE10': 10,
  'IPHONE20': 20,
  'WELCOME15': 15,
  'VIP25': 25,
};

// Validate promo code
router.post('/promo', (req, res) => {
  const { code } = req.body;
  const discount = PROMO_CODES[code?.toUpperCase()];
  if (discount) {
    res.json({ valid: true, discount, message: `Скидка ${discount}% применена!` });
  } else {
    res.json({ valid: false, discount: 0, message: 'Промокод не найден' });
  }
});

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, deliveryMethod, promoCode } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'Корзина пуста' });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let deliveryPrice = 0;
    if (deliveryMethod === 'courier') deliveryPrice = 500;
    if (deliveryMethod === 'post') deliveryPrice = 300;

    let discount = 0;
    if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
      discount = Math.round(subtotal * PROMO_CODES[promoCode.toUpperCase()] / 100);
    }

    const totalPrice = subtotal + deliveryPrice - discount;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      deliveryMethod,
      subtotal,
      deliveryPrice,
      discount,
      promoCode: promoCode || '',
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, comment } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });

    order.status = status;
    order.statusHistory.push({ status, date: new Date(), comment: comment || '' });
    if (status === 'completed' || status === 'delivered') order.paymentStatus = 'paid';
    if (status === 'cancelled') order.paymentStatus = 'refunded';

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Dashboard stats
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const newOrders = await Order.countDocuments({ status: 'new' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });

    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', totalSold: { $sum: '$items.quantity' }, totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      newOrders,
      completedOrders,
      monthlyRevenue,
      topProducts,
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
