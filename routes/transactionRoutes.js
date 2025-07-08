const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const transactionController = require("../controllers/transactionController");

const router = express.Router();
router.use(verifyJWT);

router.get("/", transactionController.getTransactions);
router.post("/", transactionController.addTransaction);
router.put("/:transactionId", transactionController.updateTransaction);
router.delete("/:transactionId", transactionController.deleteSingleTransaction);
router.delete("/", transactionController.deleteMultipleTransactions);


module.exports = router;
