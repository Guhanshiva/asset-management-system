const express = require("express");
const {
  createOrUpdateScrap,
  scrapGetList,
  scrapViewById,
  scrapListPage,
  scrapAddPage,
  scrapViewPage,
  scrapEditPage,
} = require("../controller/scrapController");
const router = express.Router();

router.post("/create", createOrUpdateScrap);
router.post("/getList", scrapGetList);
router.get("/detail/:id", scrapViewById);

router.get("/", scrapListPage);
router.get("/add", scrapAddPage);
router.get("/view/:id", scrapViewPage);
router.get("/edit/:id", scrapEditPage);

module.exports = router;
