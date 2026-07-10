const express = require("express");
const {
  createOrUpdateReturnAsset,
  getReturnAssetsList,
  viewReturnAssetById,
  returnAssetListPage,
  returnAssetAddPage,
  returnAssetEditPage,
  returnAssetViewPage,
} = require("../controller/returnAssetController");

const router = express.Router();

router.post("/create", createOrUpdateReturnAsset);
router.post("/getList", getReturnAssetsList);
router.get("/detail/:id", viewReturnAssetById);

router.get("/", returnAssetListPage);
router.get("/add", returnAssetAddPage);
router.get("/view/:id", returnAssetViewPage);
router.get("/edit/:id", returnAssetEditPage);

module.exports = router;
