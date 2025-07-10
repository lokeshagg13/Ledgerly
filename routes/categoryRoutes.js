const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const categoriesController = require("../controllers/categoriesController");

const router = express.Router();

router.use(verifyJWT);

router.get("/", categoriesController.getCategories);
router.post("/", categoriesController.addCategory);
router.put("/:categoryId", categoriesController.updateCategoryName);
router.delete("/:categoryId", categoriesController.deleteSingleCategory);
router.delete("/", categoriesController.deleteMultipleCategories);

module.exports = router;
