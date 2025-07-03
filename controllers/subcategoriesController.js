const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");

// Get all subcategories grouped by category
exports.getAllGrouped = async (req, res) => {
    try {
        const userId = req.userId;
        const categories = await Category.find({ userId });

        const response = {};

        for (let category of categories) {
            const subcategories = await Subcategory.find({ userId, categoryId: category._id });
            response[category.name] = subcategories;
        }

        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "Error fetching grouped subcategories: " + error.message });
    }
};

// Get subcategories under a specific category
exports.getByCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const { categoryId } = req.params;

        const subcategories = await Subcategory.find({ userId, categoryId });

        return res.status(200).json({ subcategories });
    } catch (error) {
        res.status(500).json({ error: "Error fetching subcategories: " + error.message });
    }
};

// Create subcategory
exports.addSubcategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        const userId = req.userId;

        if (!name || !categoryId) {
            return res.status(400).json({ error: "Subcategory name and category are required." });
        }

        const exists = await Subcategory.findOne({
            name: { $regex: `^${name.trim()}$`, $options: "i" },
            categoryId, userId
        });
        if (exists) {
            return res.status(409).json({ error: `Subcategory ${exists.name} already exists in this category.` });
        }

        const newSubcategory = await Subcategory.create({
            name: name.trim(),
            categoryId,
            userId
        });

        return res.status(201).json({ subcategory: newSubcategory });
    } catch (error) {
        res.status(500).json({ error: "Error adding subcategory: " + error.message });
    }
};

// Update subcategory
exports.updateSubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const { newName } = req.body;

        const updated = await Subcategory.findOneAndUpdate(
            { _id: subcategoryId, userId: req.userId },
            { $set: { name: newName.trim() } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Subcategory not found" });
        }

        return res.status(200).json({ subcategory: updated });
    } catch (error) {
        res.status(500).json({ error: "Error updating subcategory: " + error.message });
    }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        const deleted = await Subcategory.findOneAndDelete({
            _id: subcategoryId,
            userId: req.userId
        });

        if (!deleted) {
            return res.status(404).json({ error: "Subcategory not found" });
        }

        return res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting subcategory: " + error.message });
    }
};