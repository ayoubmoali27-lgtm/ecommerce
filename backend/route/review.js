const express = require("express");
const router = express.Router();
const { createReview, getProductReviews, deleteReview, getAllReviews} = require("../controllers/reviewController");
const { requireAuth } = require("../data.js");

router.post("/", requireAuth, createReview);                  // must be logged in
router.get("/product/:productId", getProductReviews);         // public — anyone can read reviews
router.delete("/:id", requireAuth, deleteReview);             // must be logged in (own/admin)
router.get("/", getAllReviews);
module.exports = router;