const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();
router.use(verifyJWT);

router.get("/overallBalance", dashboardController.getOverallBalance);
router.get("/custom/balance", dashboardController.getCustomBalance);
router.put("/custom/filters", dashboardController.updateCustomBalanceCardFilters);
router.put("/custom/title", dashboardController.updateCustomBalanceCardTitle);

module.exports = router;
