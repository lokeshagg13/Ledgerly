const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

subcategorySchema.index({ userId: 1, name: 1, categoryId: 1 }, { unique: true });

module.exports = mongoose.model("Subcategory", subcategorySchema);
