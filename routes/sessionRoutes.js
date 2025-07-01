const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/sessionController");

// POST /api/user
router.get("/refreshSession", refreshTokenController.handleRefreshToken);

module.exports = router;
