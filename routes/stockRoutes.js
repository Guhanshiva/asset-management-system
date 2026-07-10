const express = require("express");
const {
  getStockViewList,
  stockListPage,
  assetHistoryList,
  viewAssetHistoryById,
  historyListPage,
  historyViewPage,
} = require("../controller/stockController");
const router = express.Router();

router.post("/getList", getStockViewList);
router.post("/getListHistory", assetHistoryList);
router.get("/detail/:id", viewAssetHistoryById);

router.get("/", stockListPage);
router.get("/history", historyListPage);
router.get("/history/view/:id", historyViewPage);

module.exports = router;
