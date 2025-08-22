const mongoose = require('mongoose');
const HeadModel = require("../models/Head");

// 1. Get all heads (with optional filter for active ones)
exports.getHeads = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = { userId: req.userId };
    if (active !== undefined) {
      filter.active = active === "true";
    }

    const heads = await HeadModel.find(filter);
    return res.status(200).json({ heads });
  } catch (error) {
    res.status(500).json({ error: "Error fetching heads: " + error.message });
  }
};

// 2. Add a single head
exports.addHead = async (req, res) => {
  try {
    const { name, active } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Head name is required." });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({ error: "Head name must be under 50 characters." });
    }

    const existing = await HeadModel.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
      userId: req.userId
    });
    if (existing) {
      return res.status(409).json({ error: `Head '${existing.name}' already exists.` });
    }

    const newHead = await HeadModel.create({
      name: name.trim(),
      userId: req.userId,
      active: active !== undefined ? active : true
    });

    return res.status(201).json({ head: newHead });
  } catch (error) {
    res.status(500).json({ error: "Error adding head: " + error.message });
  }
};

// 3. Update head (name and/or active)
exports.updateHead = async (req, res) => {
  try {
    const { headId } = req.params;
    const { newName, active } = req.body;

    if (newName && newName.trim() === "") {
      return res.status(400).json({ error: "New head name cannot be empty." });
    }
    if (newName && newName.trim().length > 50) {
      return res.status(400).json({ error: "Head name must be under 50 characters." });
    }

    const current = await HeadModel.findOne({ _id: headId, userId: req.userId });
    if (!current) {
      return res.status(404).json({ error: "Head not found." });
    }

    if (newName && newName.trim().toLowerCase() !== current.name.toLowerCase()) {
      const duplicate = await HeadModel.findOne({
        _id: { $ne: headId },
        name: { $regex: `^${newName.trim()}$`, $options: "i" },
        userId: req.userId
      });
      if (duplicate) {
        return res.status(409).json({ error: `Head '${duplicate.name}' already exists.` });
      }
      current.name = newName.trim();
    }

    if (active !== undefined) {
      current.active = !!active;
    }

    await current.save();
    return res.status(200).json({ head: current });
  } catch (error) {
    res.status(500).json({ error: "Error updating head: " + error.message });
  }
};

// 4. Delete single head
exports.deleteSingleHead = async (req, res) => {
  try {
    const { headId } = req.params;

    // Add code for associated entries later??

    const deleted = await HeadModel.findOneAndDelete({
      _id: headId,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ error: "Head not found." });
    }

    return res.status(200).json({ message: "Head deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting head: " + error.message });
  }
};

// 5. Delete multiple heads
exports.deleteMultipleHeads = async (req, res) => {
  try {
    let { headIds } = req.body;

    if (!headIds) {
      return res.status(400).json({ error: "headIds is required." });
    }
    if (!Array.isArray(headIds)) {
      headIds = [headIds];
    }

    // Add code for associated entries later??

    const deletedResult = await HeadModel.deleteMany({
      _id: { $in: headIds },
      userId: req.userId
    });

    if (deletedResult.deletedCount === 0) {
      return res.status(404).json({ error: "No matching heads found to delete." });
    }

    return res.status(200).json({
      success: true,
      message: `${deletedResult.deletedCount} head(s) deleted successfully.`
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting heads: " + error.message });
  }
};
