const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyFirmUser } = require("../middlewares/verifyUserType");
const summaryController = require("../controllers/summaryController");

const router = express.Router();
router.use(verifyJWT);
router.use(verifyFirmUser);

router.get("/balanceSummary", summaryController.getBalanceSummaryForHeads);

module.exports = router;
