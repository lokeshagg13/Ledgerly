const CategoryModel = require("../models/Category");
const SubcategoryModel = require("../models/Subcategory");
const TransactionModel = require("../models/Transaction");

// Get all subcategories grouped by category
exports.getAllGrouped = async (req, res) => {
    try {
        const userId = req.userId;
        const categories = await CategoryModel.find({ userId });

        const response = {};

        for (let category of categories) {
            const subcategories = await SubcategoryModel.find({ userId, categoryId: category._id });
            response[category.name] = subcategories;
        }

        return res.status(200).json({ groupedSubcategories: response });
    } catch (error) {
        res.status(500).json({ error: "Error fetching grouped subcategories: " + error.message });
    }
};

// Get subcategories under a specific category
exports.getByCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const { categoryId } = req.params;

        const subcategories = await SubcategoryModel.find({ userId, categoryId });

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

        const trimmedName = name.trim();

        if (trimmedName.length > 20) {
            return res.status(400).json({ error: "Subcategory name must be under 20 characters." });
        }

        const exists = await SubcategoryModel.findOne({
            name: { $regex: `^${name.trim()}$`, $options: "i" },
            categoryId, userId
        });

        if (exists) {
            return res.status(409).json({ error: `Subcategory ${exists.name} already exists in this category.` });
        }

        const newSubcategory = await SubcategoryModel.create({
            name: trimmedName,
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

        if (!newName || newName.trim() === "") {
            return res.status(400).json({ error: "New subcategory name is required." });
        }

        const trimmedName = newName.trim();

        if (trimmedName.length > 20) {
            return res.status(400).json({ error: "Subcategory name must be under 20 characters." });
        }

        const updated = await SubcategoryModel.findOneAndUpdate(
            { _id: subcategoryId, userId: req.userId },
            { $set: { name: trimmedName } },
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
exports.deleteSingleSubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        // Check if category is used in any transaction
        const associatedTransaction = await TransactionModel.findOne({
            subcategoryId,
            userId: req.userId
        });

        if (associatedTransaction) {
            return res.status(400).json({
                error: "This subcategory is still linked to some transactions. Please update or remove those transactions before deleting it"
            });
        }

        const deleted = await SubcategoryModel.findOneAndDelete({
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

// Delete multiple subcategories
exports.deleteMultipleSubcategories = async (req, res) => {
    try {
        let { subcategoryIds } = req.body;

        if (!subcategoryIds) {
            return res.status(400).json({ error: "subcategoryIds is required." });
        }

        if (!Array.isArray(subcategoryIds)) {
            subcategoryIds = [subcategoryIds];
        }

        // Check which subcategoryIds are associated with existing transactions
        const associatedSubcategoryIds = await TransactionModel.distinct("subcategoryId", {
            userId: req.userId,
            subcategoryId: { $in: subcategoryIds }
        });

        if (associatedSubcategoryIds.length > 0) {
            const associatedSubcategories = await SubcategoryModel.find({
                _id: { $in: associatedSubcategoryIds }
            });

            const subcategoryNames = associatedSubcategories.map(s => s.name).join(", ");
            return res.status(400).json({
                error: `The following subcategories are still linked to some transactions: ${subcategoryNames}. Please update or remove those transactions first.`
            });
        }


        const deletedResult = await SubcategoryModel.deleteMany({
            _id: { $in: subcategoryIds },
            userId: req.userId,
        });

        if (deletedResult.deletedCount === 0) {
            return res
                .status(404)
                .json({ error: "No matching subcategories found to delete." });
        }

        return res.status(200).json({
            success: true,
            message: `${deletedResult.deletedCount} subcategory(ies) deleted successfully.`,
        });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Error deleting subcategories: " + error.message });
    }
};