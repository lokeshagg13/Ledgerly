const mongoose = require('mongoose');
const CategoryModel = require("../models/Category");
const SubcategoryModel = require("../models/Subcategory");
const TransactionModel = require("../models/Transaction");

// Get all categories for the logged-in user
exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ userId: req.userId });
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
      return res.status(400).json({ error: "Category name is required." });
    }

    if (name.trim().length > 20) {
      return res.status(400).json({ error: "Category name must be under 20 characters." });
    }

    const existing = await CategoryModel.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
      userId: req.userId
    });
    if (existing) {
      return res.status(409).json({
        error: `Category ${existing.name} already exists.`
      });
    }

    const newCategory = await CategoryModel.create({
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

    const trimmedName = newName.trim();

    if (trimmedName.length > 20) {
      return res.status(400).json({ error: "Category name must be under 20 characters." });
    }

    const current = await CategoryModel.findOne({
      _id: categoryId,
      userId: req.userId,
    });

    if (!current) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (current.name === trimmedName) {
      return res.status(200).json({ category: current });
    }

    const duplicate = await CategoryModel.findOne({
      _id: { $ne: categoryId },
      name: { $regex: `^${trimmedName}$`, $options: "i" },
      userId: req.userId,
    });

    if (duplicate) {
      return res.status(409).json({ error: `Category ${duplicate.name} already exists.` });
    }

    current.name = trimmedName;
    await current.save();

    return res.status(200).json({ category: current });
  } catch (error) {
    res.status(500).json({ error: "Error updating category: " + error.message });
  }
};

// Delete category and corresponding subcategories
exports.deleteSingleCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category is used in any transaction
    const associatedTransaction = await TransactionModel.findOne({
      categoryId,
      userId: req.userId
    });

    if (associatedTransaction) {
      return res.status(400).json({
        error: "This category is still linked to some transactions. Please update or remove those transactions before deleting it"
      });
    }

    const deleted = await CategoryModel.findOneAndDelete({
      _id: categoryId,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Category not found." });
    }

    await SubcategoryModel.deleteMany({ categoryId, userId: req.userId });

    return res.status(200).json({
      message: "Category and its subcategories deleted"
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category: " + error.message });
  }
};

// Delete multiple categories and their subcategories
exports.deleteMultipleCategories = async (req, res) => {
  try {
    let { categoryIds } = req.body;

    if (!categoryIds) {
      return res.status(400).json({ error: "categoryIds is required." });
    }

    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }

    // Check which categoryIds are associated with existing transactions
    const associatedCategoryIds = await TransactionModel.distinct(
      "categoryId", {
      userId: req.userId,
      categoryId: { $in: categoryIds }
    });

    if (associatedCategoryIds.length > 0) {
      const associatedCategories = await CategoryModel.find({
        _id: { $in: associatedCategoryIds }
      });

      const categoryNames = associatedCategories.map(c => c.name).join(", ");
      return res.status(400).json({
        error: `The following categories are still linked to some transactions: ${categoryNames}. Please update or remove those transactions first.`
      });
    }

    const deletedResult = await CategoryModel.deleteMany({
      _id: { $in: categoryIds },
      userId: req.userId,
    });

    if (deletedResult.deletedCount === 0) {
      return res.status(404).json({ error: "No matching categories found to delete." });
    }

    await SubcategoryModel.deleteMany({
      categoryId: { $in: categoryIds },
      userId: req.userId,
    });

    return res.status(200).json({
      success: true,
      message: `${deletedResult.deletedCount} category(ies) and their subcategories deleted.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category(ies): " + error.message });
  }
};
