const {cart} = require("../Model/model");
const {isValidCustomer} = require('../Utils/utils');

// Cart Services
exports.addToCart = async (req, res) => {
  try {
    const { medicineId, customerId } = req.params;
    const { quantity } = req.body;

    // Validate customer
    const customerExists = await isValidCustomer(customerId);
    if (!customerExists) {
      return res.status(404).json({ status: 'fail', message: 'Customer not found' });
    }

    const findCart = await cart.findOne({ customerId });

    let cartDetails;

    if (!findCart) {
      cartDetails = await cart.create({
        customerId: customerId,
        medicines: [{ medicineId, quantity }]
      });
    } else {
      const medicineIndex = findCart.medicines.findIndex(item => item.medicineId === medicineId);

      if (medicineIndex !== -1) {
        findCart.medicines[medicineIndex].quantity += quantity;
      } else {
        findCart.medicines.push({ medicineId, quantity });
      }

      await findCart.save();
      cartDetails = findCart;
    }

    res.status(200).json({
      status:'success',
      message: 'Medicine added to cart successfully',
      data: cartDetails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Something went wrong' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate customer
    const customerExists = await isValidCustomer(customerId);
    if (!customerExists) {
      return res.status(404).json({ status: 'fail', message: 'Customer not found' });
    }

    const cartDetails = await cart.findOne({ customerId }).populate("medicines.medicineId");

    if (!cartDetails) {
      return res.status(404).json({ status: 'fail', message: 'Cart is empty' });
    }

    res.status(200).json({
      status:'success',
      message: 'Cart retrieved successfully',
      data: cartDetails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Something went wrong' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { medicineId, customerId } = req.params;
    const { quantity } = req.body;

    // Validate customer
    const customerExists = await isValidCustomer(customerId);
    if (!customerExists) {
      return res.status(404).json({ status: 'fail', message: 'Customer not found' });
    }

    const findCart = await cart.findOne({ customerId });

    if (!findCart) {
      return res.status(404).json({ status: 'fail', message: 'Cart not found' });
    }

    const medicineIndex = findCart.medicines.findIndex(item => item.medicineId === medicineId);

    if (medicineIndex === -1) {
      return res.status(404).json({ status: 'fail', message: 'Medicine not found in cart' });
    }

    if (quantity === 0) {
      findCart.medicines.splice(medicineIndex, 1);
    } else {
      findCart.medicines[medicineIndex].quantity = quantity;
    }

    await findCart.save();

    res.status(200).json({
      status:'success',
      message: 'Cart updated successfully',
      data: findCart
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Something went wrong' });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customerExists = await isValidCustomer(customerId);
    if (!customerExists) {
      return res.status(404).json({ status: 'fail', message: 'Customer not found' });
    }

    const delete_cart = await cart.deleteOne({ customerId: customerId })
    
    res.status(200).json({
      status: 'success',
      message: 'Removed all items from the cart',
      data: delete_cart
    })
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Something went wrong' });
  }
}

exports.invalidRoute = (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Invalid route'
  })
}