const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyFirmUser } = require("../middlewares/verifyUserType");
const entrySetController = require("../controllers/entrySetController");

const router = express.Router();

router.use(verifyJWT);
router.use(verifyFirmUser);

router.post("/", entrySetController.createEntrySet);
router.get("/", entrySetController.getAllEntrySets);
router.get("/:id", entrySetController.getAllEntriesForEntrySet);
router.put("/:id", entrySetController.updateEntrySet);
router.delete("/:entrySetId", entrySetController.deleteSingleEntrySet);
router.delete("/", entrySetController.deleteMultipleEntrySets);

module.exports = router;
