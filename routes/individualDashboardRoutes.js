const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyIndividualUser } = require("../middlewares/verifyUserType");
const individualDashboardController = require("../controllers/individualDashboardController");

const router = express.Router();
router.use(verifyJWT);
router.use(verifyIndividualUser);

router.get("/overallBalance", individualDashboardController.getOverallBalance);
router.get("/custom/balance", individualDashboardController.getCustomBalance);
router.get("/custom/title", individualDashboardController.getCustomBalanceCardTitle);
router.put("/custom/filters", individualDashboardController.updateCustomBalanceCardFilters);
router.put("/custom/title", individualDashboardController.updateCustomBalanceCardTitle);
router.get("/financial-years", individualDashboardController.getFinancialYears);
router.get("/series/dailyBalance", individualDashboardController.getDailyBalanceSeries);
router.get("/series/monthlySpending", individualDashboardController.getMonthlySpendingSeries);
router.get("/series/monthlyBalance", individualDashboardController.getMonthlyBalanceSeries);

module.exports = router;
