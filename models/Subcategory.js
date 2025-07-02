const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true
  }
}, { timestamps: true });

subcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

module.exports = mongoose.model("Subcategory", subcategorySchema);
