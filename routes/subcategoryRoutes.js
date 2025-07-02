const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const subcategoriesController = require("../controllers/subcategoriesController");

const router = express.Router();

router.use(verifyJWT);

router.get("/subcategories", subcategoriesController.getAllGrouped);
router.get("/subcategories/:categoryId", subcategoriesController.getByCategory);
router.post("/subcategories", subcategoriesController.addSubcategory);
router.put("/subcategories/:subcategoryId", subcategoriesController.updateSubcategory);
router.delete("/subcategories/:subcategoryId", subcategoriesController.deleteSubcategory);

module.exports = router;
