const { IssueAsset, ReturnAsset, Asset, Employee } = require("../models");

const { Validator } = require("node-input-validator");
const { Op } = require("sequelize");

const createOrUpdateReturnAsset = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      issueAssetId: "required",
      returnDate: "required|date",
      reason: "required|in:Upgrade,Repair,Resignation,Other",
    });

    const matched = await v.check();

    if (!matched) {
      return res.status(400).json({
        success: false,
        errors: v.errors,
      });
    }

    const payload = req.body;

    if (!payload.id) {
      delete payload.id;
    }

    // Issue asset exists
    const issueAsset = await IssueAsset.findByPk(payload.issueAssetId);

    if (!issueAsset) {
      return res.status(400).json({
        success: false,
        message: "Issue Asset not found.",
      });
    }

    const returnWhere = {
      issueAssetId: payload.issueAssetId,
    };

    if (payload.id) {
      returnWhere.id = {
        [Op.ne]: payload.id,
      };
    }

    const existingReturn = await ReturnAsset.findOne({
      where: returnWhere,
    });

    if (existingReturn) {
      return res.status(400).json({
        success: false,
        message: "Asset has already been returned.",
      });
    }

    // Update
    if (payload.id) {
      const [updatedRows] = await ReturnAsset.update(payload, {
        where: {
          id: payload.id,
        },
      });

      if (updatedRows === 0) {
        return res.status(400).json({
          success: false,
          message: "Return Asset not found.",
        });
      }

      const returnAsset = await ReturnAsset.findByPk(payload.id);

      return res.status(200).json({
        success: true,
        message: "Return Asset updated successfully.",
        data: returnAsset,
      });
    }

    // Create
    const returnAsset = await ReturnAsset.create(payload);

    // Update IssueAsset status
    await IssueAsset.update(
      {
        status: "Returned",
      },
      {
        where: {
          id: payload.issueAssetId,
        },
      },
    );

    // Update asset status
    await Asset.update(
      {
        status: "In Stock",
      },
      {
        where: {
          id: issueAsset.assetId,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Asset returned successfully.",
      data: returnAsset,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getReturnAssetsList = async (req, res) => {
  try {
    const returnAssets = await ReturnAsset.findAll({
      include: [
        {
          model: IssueAsset,
          attributes: ["id", "issueDate", "status"],
          include: [
            {
              model: Employee,
              attributes: ["id", "empCode", "name", "department"],
            },
            {
              model: Asset,
              attributes: [
                "id",
                "assetCode",
                "serialNumber",
                "assetName",
                "make",
                "model",
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Return asset fetched successfully",
      data: returnAssets,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const viewReturnAssetById = async (req, res) => {
  try {
    const id = req.params.id;

    const returnAsset = await ReturnAsset.findByPk(id, {
      include: [
        {
          model: IssueAsset,
          attributes: ["id", "issueDate", "status"],
          include: [
            {
              model: Employee,
              attributes: [
                "id",
                "empCode",
                "name",
                "department",
                "designation",
              ],
            },
            {
              model: Asset,
              attributes: [
                "id",
                "assetCode",
                "serialNumber",
                "assetName",
                "make",
                "model",
                "status",
              ],
            },
          ],
        },
      ],
    });

    if (!returnAsset) {
      return res.status(404).json({
        success: false,
        message: "Return Asset not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Return asset fetched successfully",
      data: returnAsset,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const returnAssetListPage = (req, res) => {
  res.render("returnAsset/list");
};

const returnAssetAddPage = (req, res) => {
  res.render("returnAsset/add");
};

const returnAssetViewPage = (req, res) => {
  res.render("returnAsset/view", {
    id: req.params.id,
  });
};

const returnAssetEditPage = (req, res) => {
  res.render("returnAsset/edit", {
    id: req.params.id,
  });
};

module.exports = {
  createOrUpdateReturnAsset,
  getReturnAssetsList,
  viewReturnAssetById,
  returnAssetListPage,
  returnAssetAddPage,
  returnAssetViewPage,
  returnAssetEditPage,
};
