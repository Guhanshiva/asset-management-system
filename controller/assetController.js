const { Asset, AssetCategory } = require("../models");
const { Validator } = require("node-input-validator");
const { Op } = require("sequelize");

const createOrUpdateAsset = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      assetCode: "required|string",
      serialNumber: "required|string",
      assetName: "required|string",
      categoryId: "required",
      make: "required|string",
      model: "required|string",
      status: "required|in:In Stock,Issued,Repair,Scrapped",
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

    const assetCodeWhere = {
      assetCode: payload.assetCode,
    };

    const serialNumberWhere = {
      serialNumber: payload.serialNumber,
    };

    if (payload.id) {
      assetCodeWhere.id = {
        [Op.ne]: payload.id,
      };

      serialNumberWhere.id = {
        [Op.ne]: payload.id,
      };
    }

    const exitAssetCode = await Asset.findOne({
      where: assetCodeWhere,
    });
    if (exitAssetCode) {
      return res.status(400).json({
        success: false,
        message: "Asset code already exists",
      });
    }

    const exitSerialNumber = await Asset.findOne({
      where: serialNumberWhere,
    });

    if (exitSerialNumber) {
      return res.status(400).json({
        success: false,
        message: "Serial number already exists",
      });
    }
    if (payload.id) {
      const [updateAsset] = await Asset.update(payload, {
        where: { id: payload.id },
      });

      if (updateAsset === 0) {
        return res.status(400).json({
          success: false,
          message: "Asset not found",
        });
      }

      const asset = await Asset.findByPk(payload.id);

      if (asset) {
        return res.status(200).json({
          success: true,
          message: "Asset updated successfully",
          data: asset,
        });
      }
    }

    const createAsset = await Asset.create(payload);

    return res.status(201).json({
      success: true,
      message: "Asset created successfully",
      data: createAsset,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAssetList = async (req, res) => {
  try {
    console.log(req.body);
    const where = {
      status: {
        [Op.ne]: "Scrapped",
      },
    };

    if (req.body?.status) {
      where.status = req.body.status;
    }

    if (req.body?.categoryId) {
      where.categoryId = req.body.categoryId;
    }

    if (req.body?.make) {
      where.make = {
        [Op.iLike]: `%${req.body.make}%`,
      };
    }

    if (req.body?.model) {
      where.model = {
        [Op.iLike]: `%${req.body.model}%`,
      };
    }

    const assetList = await Asset.findAndCountAll({
      where,
      include: [
        {
          model: AssetCategory,
          attributes: ["categoryName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Asset list fetched successfully",
      totalRecords: assetList.count,
      data: assetList.rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const viewAssetById = async (req, res) => {
  try {
    const id = req.params.id;

    const asset = await Asset.findByPk(id, {
      include: [
        {
          model: AssetCategory,
          attributes: ["categoryName"],
        },
      ],
    });

    if (!asset) {
      return res.status(400).json({
        success: false,
        message: "asset not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Asset details fetched successfully",
      data: asset,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const assetListPage = (req, res) => {
  res.render("asset/list");
};

const assetAddPage = (req, res) => {
  res.render("asset/add");
};

const assetViewPage = (req, res) => {
  res.render("asset/view", {
    id: req.params.id,
  });
};

const assetEditPage = (req, res) => {
  res.render("asset/edit", {
    id: req.params.id,
  });
};
module.exports = {
  createOrUpdateAsset,
  getAssetList,
  viewAssetById,
  assetListPage,
  assetAddPage,
  assetViewPage,
  assetEditPage,
};
