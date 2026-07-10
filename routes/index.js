const employeeRoutes = require("./employeeRoutes");
const categoryRoutes = require("./categoryRoutes");
const assetRoutes = require("./assetRoutes");
const issueAssetRoutes = require("./issueAssetRoutes");
const returnAssetRoutes = require("./returnAssetRoutes");
const stockRoutes = require("./stockRoutes");
const scrapRoutes = require("./scrapRoutes");
module.exports = (app) => {
  app.use("/api/employees", employeeRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/asset", assetRoutes);
  app.use("/api/issueAsset", issueAssetRoutes);
  app.use("/api/returnAsset", returnAssetRoutes);
  app.use("/api/stock", stockRoutes);
  app.use("/api/scrap", scrapRoutes);
};
