const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyIndividualUser, verifyFirmUser } = require("../middlewares/verifyUserType");
const headsController = require("../controllers/headsController");

const router = express.Router();

router.use(verifyJWT);
router.use(verifyIndividualUser);

router.get("/", headsController.getHeads);
router.post("/", headsController.addHead);
router.post("/bulk", headsController.addBulkHeads);
router.put("/:headId", headsController.updateHead);
router.delete("/:headId", headsController.deleteSingleHead);
router.delete("/", headsController.deleteMultipleHeads);

module.exports = router;
