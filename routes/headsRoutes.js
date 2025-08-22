const express = require("express");
const upload = require("../middlewares/multerStorage");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyFirmUser } = require("../middlewares/verifyUserType");
const headsController = require("../controllers/headsController");
const uploadHeadsController = require("../controllers/uploadHeadsController")

const router = express.Router();

router.use(verifyJWT);
router.use(verifyFirmUser);

router.get("/", headsController.getHeads);
router.post("/", headsController.addHead);
router.put("/:headId", headsController.updateHead);
router.delete("/:headId", headsController.deleteSingleHead);
router.delete("/", headsController.deleteMultipleHeads);

router.post("/extract", upload.single('file'), uploadHeadsController.extractHeadsFromPDF);
router.post("/upload", uploadHeadsController.uploadBulkHeads);

module.exports = router;
