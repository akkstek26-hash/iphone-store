const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  images: [{ type: String }],
  category: { type: String, required: true },
  generation: { type: String, default: '' },
  year: { type: Number, required: true },
  colors: [{ name: String, hex: String }],
  storage: [{ size: String, priceAdd: Number }],
  specs: {
    display: String,
    chip: String,
    camera: String,
    battery: String,
    weight: String,
    os: String,
    water: String,
    connectivity: String,
  },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 100 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  featured: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: false },
}, { timestamps: true, suppressReservedKeysWarning: true });

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ year: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
