const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  color: { type: String },
  storage: { type: String },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'Россия' },
  },
  paymentMethod: { type: String, required: true, enum: ['card', 'paypal', 'cash'] },
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed', 'refunded'] },
  deliveryMethod: { type: String, required: true, enum: ['courier', 'pickup', 'post'] },
  subtotal: { type: Number, required: true },
  deliveryPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  promoCode: { type: String, default: '' },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    default: 'new',
    enum: [
      'new',
      'confirmed',
      'processing',
      'packing',
      'shipped',
      'in_transit',
      'delivering',
      'delivered',
      'completed',
      'cancelled',
    ],
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    comment: String,
  }],
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    this.statusHistory = [{ status: 'new', date: new Date(), comment: 'Заказ создан' }];
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
