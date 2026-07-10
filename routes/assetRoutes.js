const express = require("express");
const {
  createOrUpdateAsset,
  getAssetList,
  viewAssetById,
  assetListPage,
  assetAddPage,
  assetViewPage,
  assetEditPage,
} = require("../controller/assetController");
const router = express.Router();

router.post("/create", createOrUpdateAsset);
router.post("/getList", getAssetList);
router.get("/detail/:id", viewAssetById);

router.get("/", assetListPage);
router.get("/add", assetAddPage);
router.get("/view/:id", assetViewPage);
router.get("/edit/:id", assetEditPage);

module.exports = router;
