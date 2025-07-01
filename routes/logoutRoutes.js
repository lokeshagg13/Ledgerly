const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();
const logoutController = require("../controllers/logoutController");

// POST /api/user
router.route("/logout").get(verifyJWT, logoutController.logoutUser);

module.exports = router;
