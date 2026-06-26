const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user_id: {
    type: String,        // user lives in SQL, so plain string
    required: true,
    unique: true,        // one cart per user
  },
  items: {
    type: [cartItemSchema],   // an array of cart items
    default: [],
  },
}, {
  timestamps: true,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart