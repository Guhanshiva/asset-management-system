const express = require("express");
const {
  createOrUpdateCategory,
  getCategoryList,
  viewCategoryById,
  categoryListPage,
  categoryAddPage,
  categoryViewPage,
  categoryEditPage,
} = require("../controller/categoryController");
const router = express.Router();

router.post("/create", createOrUpdateCategory);
router.post("/getList", getCategoryList);
router.get("/detail/:id", viewCategoryById);

router.get("/", categoryListPage);
router.get("/add", categoryAddPage);
router.get("/view/:id", categoryViewPage);
router.get("/edit/:id", categoryEditPage);

module.exports = router;
