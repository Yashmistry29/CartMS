const express = require('express');
const router = express.Router();
const services = require('../Services/services');

// Cart Routes
router.post('/cart/:medicineId/:customerId', services.addToCart);
router.get('/cart/:customerId', services.getCart);
router.put('/cart/update/:medicineId/:customerId', services.updateCart);
router.delete('/cart/:customerId', services.deleteCart);
router.all('*', services.invalidRoute);

module.exports = router;
