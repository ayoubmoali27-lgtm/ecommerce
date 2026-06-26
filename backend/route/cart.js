const express = require("express");
const router = express.Router();
const { requireAuth } = require("../data.js");
const { getCart, addToCart, updateCartItem, removeFromCart } = require("../controllers/cartController");

router.get("/", requireAuth, getCart);
router.post("/", requireAuth, addToCart);
router.put("/:productId", requireAuth, updateCartItem);
router.delete("/:productId", requireAuth, removeFromCart);

module.exports = router;