const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyIndividualUser } = require("../middlewares/verifyUserType");
const subcategoriesController = require("../controllers/subcategoriesController");

const router = express.Router();

router.use(verifyJWT);
router.use(verifyIndividualUser);

router.get("/", subcategoriesController.getAllGrouped);
router.get("/:categoryId", subcategoriesController.getByCategory);
router.post("/", subcategoriesController.addSubcategory);
router.put("/:subcategoryId", subcategoriesController.updateSubcategory);
router.delete("/:subcategoryId", subcategoriesController.deleteSingleSubcategory);
router.delete("/", subcategoriesController.deleteMultipleSubcategories);

module.exports = router;
