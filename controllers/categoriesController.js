const CategoriesModel = require("../models/Category");
const SubcategoryModel = require("../models/Subcategory");

// Get all categories for the logged-in user
exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoriesModel.find({ userId: req.userId });
    return res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories: " + error.message });
  }
};

// Add a new category for the logged-in user
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Check for duplicate
    const existing = await CategoriesModel.findOne({ name: name.trim(), userId: req.userId });
    if (existing) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const newCategory = await CategoriesModel.create({
      name: name.trim(),
      userId: req.userId,
    });

    return res.status(201).json({ category: newCategory });
  } catch (error) {
    res.status(500).json({ error: "Error adding category: " + error.message });
  }
};

// Update the name of a category
exports.updateCategoryName = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { newName } = req.body;

    if (!newName || newName.trim() === "") {
      return res.status(400).json({ error: "New category name is required" });
    }

    const updated = await CategoriesModel.findOneAndUpdate(
      { _id: categoryId, userId: req.userId },
      { $set: { name: newName.trim() } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ category: updated });
  } catch (error) {
    res.status(500).json({ error: "Error updating category: " + error.message });
  }
};

// Delete category and corresponding subcategories
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const deleted = await CategoriesModel.findOneAndDelete({
      _id: categoryId,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    // 🧹 Delete subcategories tied to this category
    await Subcategory.deleteMany({ categoryId, userId: req.userId });

    return res.status(200).json({ message: "Category and its subcategories deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category: " + error.message });
  }
};
