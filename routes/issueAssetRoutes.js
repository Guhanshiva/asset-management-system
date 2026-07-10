const express = require("express");
const {
  createOrUpdateIssueAsset,
  getIssueAssetsList,
  issueAssetListPage,
  IssueAssetAddPage,
  viewIssueAssetById,
  issueAssetViewPage,
  issueAssetEditPage,
} = require("../controller/issueAssetController");
const router = express.Router();

router.post("/create", createOrUpdateIssueAsset);
router.post("/getList", getIssueAssetsList);
router.get("/detail/:id", viewIssueAssetById);

router.get("/", issueAssetListPage);
router.get("/add", IssueAssetAddPage);
router.get("/view/:id", issueAssetViewPage);
router.get("/edit/:id", issueAssetEditPage);

module.exports = router;
