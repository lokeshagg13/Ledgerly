const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyFirmUser } = require("../middlewares/verifyUserType");
const firmDashboardController = require("../controllers/firmDashboardController");

const router = express.Router();
router.use(verifyJWT);
router.use(verifyFirmUser);

router.get("/overallBalance", firmDashboardController.getCurrentBalance);

module.exports = router;
