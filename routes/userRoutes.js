const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const userController = require("../controllers/userController");

// POST /api/user
router.post("/register", userController.registerUser);
router.put("/profile", verifyJWT, userController.updateUserProfile);
router.put("/updatePassword", verifyJWT, userController.updatePassword);

module.exports = router;
