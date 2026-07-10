const {
  Asset,
  AssetCategory,
  IssueAsset,
  ReturnAsset,
  Employee,
} = require("../models");

const getStockViewList = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: {
        status: "In Stock",
      },
      include: [
        {
          model: AssetCategory,
          attributes: ["id", "categoryName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Total asset count
    const totalAssets = assets.length;

    // Total asset value
    const totalValue = assets.reduce(
      (sum, asset) => sum + Number(asset.purchasePrice),
      0,
    );

    // Branch-wise summary
    const branchSummary = assets.reduce((acc, asset) => {
      const branch = asset.branch;

      if (!acc[branch]) {
        acc[branch] = {
          totalAssets: 0,
          totalValue: 0,
        };
      }

      acc[branch].totalAssets += 1;
      acc[branch].totalValue += Number(asset.purchasePrice);

      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      totalAssets,
      totalValue,
      branchSummary,
      data: assets,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const assetHistoryList = async (req, res) => {
  try {
    const assets = await Asset.findAndCountAll({
      include: [
        {
          model: AssetCategory,
          attributes: ["id", "categoryName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Asset history fetched successfully",
      totalRecords: assets.count,
      data: assets.rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const viewAssetHistoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const asset = await Asset.findByPk(id, {
      include: [
        {
          model: AssetCategory,
          attributes: ["id", "categoryName"],
        },
      ],
    });

    if (!asset) {
      return res.status(400).json({
        success: false,
        message: "Asset not found.",
      });
    }

    const issueHistory = await IssueAsset.findAll({
      where: {
        assetId: id,
      },
      include: [
        {
          model: Employee,
          attributes: ["id", "empCode", "name", "department"],
        },
        {
          model: ReturnAsset,
          attributes: ["id", "returnDate", "reason"],
          required: false,
        },
      ],
      order: [["issueDate", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Asset details fetched successfully",
      data: {
        asset,
        issueHistory,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const stockListPage = (req, res) => {
  res.render("stock/list");
};

const historyListPage = (req, res) => {
  res.render("history/list");
};

const historyViewPage = (req, res) => {
  res.render("history/view", {
    id: req.params.id,
  });
};

module.exports = {
  getStockViewList,
  stockListPage,
  assetHistoryList,
  viewAssetHistoryById,
  historyListPage,
  historyViewPage,
};
