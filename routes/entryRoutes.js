const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyFirmUser } = require("../middlewares/verifyUserType");
const entriesController = require("../controllers/entriesController");

const router = express.Router();

router.use(verifyJWT);
router.use(verifyFirmUser);

router.post("/", entriesController.createEntry);
router.get("/", entriesController.getAllDaywiseEntries);
router.get("/:id", entriesController.getEntryItemsForId);

module.exports = router;
