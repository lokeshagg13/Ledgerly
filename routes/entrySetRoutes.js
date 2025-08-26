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

module.exports = router;
