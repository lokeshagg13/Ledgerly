const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();
router.use(verifyJWT);

router.get("/balance", dashboardController.getBalance);

module.exports = router;
