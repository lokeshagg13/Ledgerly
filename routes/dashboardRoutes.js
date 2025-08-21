const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();
router.use(verifyJWT);

router.get("/overallBalance", dashboardController.getOverallBalance);
router.get("/custom/balance", dashboardController.getCustomBalance);
router.get("/custom/title", dashboardController.getCustomBalanceCardTitle);
router.put("/custom/filters", dashboardController.updateCustomBalanceCardFilters);
router.put("/custom/title", dashboardController.updateCustomBalanceCardTitle);
router.get("/financial-years", dashboardController.getFinancialYears);
router.get("/series/dailyBalance", dashboardController.getDailyBalanceSeries);
router.get("/series/monthlySpending", dashboardController.getMonthlySpendingSeries);
router.get("/series/monthlyBalance", dashboardController.getMonthlyBalanceSeries);

module.exports = router;
