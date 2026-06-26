const Cart = require("../models/cart");

// GET /api/cart  (the logged-in user's cart)
async function getCart(req, res) {
  try {
    let cart = await Cart.findOne({ user_id: req.user.id }).populate("items.product_id");

    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id, items: [] });
    }

    res.json({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}

// POST /api/cart  (add an item, or bump quantity if already there)
async function addToCart(req, res) {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ error: "Product and quantity are required" });
    }

    let cart = await Cart.findOne({ user_id: req.user.id });

    // no cart yet → create one with this item
    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        items: [{ product_id, quantity }],
      });
      return res.status(201).json({ cart });
    }

    // cart exists → is this product already in it?
    const item = cart.items.find((i) => i.product_id.toString() === product_id);

    if (item) {
      item.quantity += quantity;     // already there → add to its quantity
    } else {
      cart.items.push({ product_id, quantity });   // not there → add new item
    }

    await cart.save();
    res.json({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}

// PUT /api/cart/:productId  (set an item's quantity)
async function updateCartItem(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find((i) => i.product_id.toString() === productId);
    if (!item) {
      return res.status(404).json({ error: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    res.json({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}

// DELETE /api/cart/:productId  (remove an item)
async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.product_id.toString() !== productId);
    await cart.save();
    res.json({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };