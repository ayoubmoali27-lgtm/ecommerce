const express = require("express");
const router = express.Router();
const { createOrder, requireAuth, getAllOrders , getOrder, requireAdmin, updateOrder } = require("../data.js");

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, requireAdmin, getAllOrders);
router.get("/:id", requireAuth, getOrder);
router.put("/:id", requireAuth, requireAdmin , updateOrder);
module.exports = router;