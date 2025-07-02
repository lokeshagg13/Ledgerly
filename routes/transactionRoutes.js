const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();
router.use(verifyJWT);

module.exports = router;
