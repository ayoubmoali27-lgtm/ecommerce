const Review = require("../models/review");

// POST /api/reviews  (logged-in user writes a review)
async function createReview(req, res) {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: "Product and rating are required" });
    }

    const review = await Review.create({
      product_id,
      rating,
      comment,
      user_id: req.user.id,        // from the token, NOT the body
      author_name: req.user.name,  // from the token
    });

    res.status(201).json({ review });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}

// GET /api/reviews/product/:productId  (all reviews for one product)
async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product_id: productId });
    res.json({ reviews });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}
async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(6);
    res.json({ reviews });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}
// DELETE /api/reviews/:id  (delete own review)
async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // only the author (or an admin) can delete
    if (review.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    await Review.findByIdAndDelete(id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}

module.exports = { createReview, getProductReviews, deleteReview, getAllReviews };