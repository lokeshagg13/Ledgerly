const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const categoriesController = require("../controllers/categoriesController");

const router = express.Router();

router.use(verifyJWT);

router.get("/categories", categoriesController.getCategories);
router.post("/categories", categoriesController.addCategory);
router.put("/categories/:categoryId", categoriesController.updateCategoryName);
router.delete("/categories/:categoryId", categoriesController.deleteCategory);

module.exports = router;
