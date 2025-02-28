const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  medicines: [{
    medicineId: { type: String, required: true },
    quantity: { type: Number, required: true }
  }]
});

const dbModels = {};

dbModels.cart = mongoose.model('cart', cartSchema, 'Cart');

module.exports = dbModels;