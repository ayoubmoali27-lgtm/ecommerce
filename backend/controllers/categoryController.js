const Category = require("../models/category");

async function createCategory(req, res) {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: "name and slug are required" });
    }

    const category = await Category.create({ name, slug });
    res.status(201).json({ category });
    return res.status(400).json({ error: "Something went wrong" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
}

async function getAllCategory(req, res) {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
}

async function getCategory(req, res) {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(400).json({ error: "category not found" });
    }
    res.json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }
    res.json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted", category });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
}

module.exports = {
  deleteCategory,
  updateCategory,
  getCategory,
  createCategory,
  getAllCategory,
};
