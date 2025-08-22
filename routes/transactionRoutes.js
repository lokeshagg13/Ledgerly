const express = require("express");
const upload = require("../middlewares/multerStorage");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyIndividualUser } = require("../middlewares/verifyUserType");
const transactionController = require("../controllers/transactionController");
const uploadTransactionController = require("../controllers/uploadTransactionController");
const printTransactionController = require("../controllers/printTransactionController");

const router = express.Router();

router.use(verifyJWT);
router.use(verifyIndividualUser);

router.get("/", transactionController.getTransactions);
router.post("/", transactionController.addTransaction);
router.put("/:transactionId", transactionController.updateTransaction);
router.delete("/:transactionId", transactionController.deleteSingleTransaction);
router.delete("/", transactionController.deleteMultipleTransactions);

router.post("/extract", upload.single('file'), uploadTransactionController.extractTransactionsFromPDF);
router.post("/upload", uploadTransactionController.uploadBulkTransactions);

router.get("/print", printTransactionController.getTransactionsWithPrintPreview);

module.exports = router;
