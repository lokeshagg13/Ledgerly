const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /api/user
router.post("/login", authController.loginUser);

module.exports = router;
