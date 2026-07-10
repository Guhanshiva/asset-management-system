const { IssueAsset, AssetCategory, Employee, Asset } = require("../models");

const { Validator } = require("node-input-validator");
const { Op } = require("sequelize");
const { viewAssetById } = require("./assetController");

const createOrUpdateIssueAsset = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      employeeId: "required",
      assetId: "required",
      issueDate: "required|date",
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

    // employee exists
    const employee = await Employee.findByPk(payload.employeeId);

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // asset exists
    const asset = await Asset.findByPk(payload.assetId);

    if (!asset) {
      return res.status(400).json({
        success: false,
        message: "Asset not found.",
      });
    }

    // asset availability
    if (!payload.id && asset.status !== "In Stock") {
      return res.status(400).json({
        success: false,
        message: "Asset is not available for issue.",
      });
    }

    // Update
    if (payload.id) {
      const [updatedRows] = await IssueAsset.update(payload, {
        where: {
          id: payload.id,
        },
      });

      if (updatedRows === 0) {
        return res.status(400).json({
          success: false,
          message: "Issue Asset record not found.",
        });
      }

      const issueAsset = await IssueAsset.findByPk(payload.id);

      return res.status(200).json({
        success: true,
        message: "Issue Asset updated successfully.",
        data: issueAsset,
      });
    }

    // Create
    const issueAsset = await IssueAsset.create(payload);

    // Update asset status
    await asset.update({
      status: "Issued",
    });

    return res.status(200).json({
      success: true,
      message: "Asset issued successfully.",
      data: issueAsset,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getIssueAssetsList = async (req, res) => {
  try {
    const issueAssets = await IssueAsset.findAndCountAll({
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
            "status",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      totalRecords: issueAssets.count,
      data: issueAssets.rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const viewIssueAssetById = async (req, res) => {
  try {
    const id = req.params.id;

    const issueAsset = await IssueAsset.findByPk(id, {
      include: [
        {
          model: Employee,
          attributes: ["id", "empCode", "name", "department", "designation"],
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
    });

    if (!issueAsset) {
      return res.status(404).json({
        success: false,
        message: "Issue Asset not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue asset detail fetched successfully",
      data: issueAsset,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const issueAssetListPage = (req, res) => {
  res.render("issueAsset/list");
};

const IssueAssetAddPage = (req, res) => {
  res.render("issueAsset/add");
};

const issueAssetViewPage = (req, res) => {
  res.render("issueAsset/view", {
    id: req.params.id,
  });
};

const issueAssetEditPage = (req, res) => {
  res.render("issueAsset/edit", {
    id: req.params.id,
  });
};

module.exports = {
  createOrUpdateIssueAsset,
  getIssueAssetsList,
  viewIssueAssetById,
  issueAssetListPage,
  IssueAssetAddPage,
  issueAssetViewPage,
  issueAssetEditPage,
};
