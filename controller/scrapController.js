const { Scrap, Asset } = require("../models");
const { Validator } = require("node-input-validator");
const { Op } = require("sequelize");

const createOrUpdateScrap = async (req, res) => {
  try {
    const payload = req.body;

    const v = new Validator(payload, {
      assetId: "required",
      scrapDate: "required|date",
      reason: "required|string",
    });

    const matched = await v.check();

    if (!matched) {
      return res.status(400).json({
        success: false,
        errors: v.errors,
      });
    }

    if (!payload.id) {
      delete payload.id;
    }

    // asset exists
    const asset = await Asset.findByPk(payload.assetId);

    if (!asset) {
      return res.status(400).json({
        success: false,
        message: "Asset not found.",
      });
    }

    // duplicate check
    const scrapWhere = {
      assetId: payload.assetId,
    };

    if (payload.id) {
      scrapWhere.id = {
        [Op.ne]: payload.id,
      };
    }

    const existingScrap = await Scrap.findOne({
      where: scrapWhere,
    });

    if (existingScrap) {
      return res.status(400).json({
        success: false,
        message: "Asset already scrapped.",
      });
    }

    // Update
    if (payload.id) {
      const [updatedRows] = await Scrap.update(payload, {
        where: {
          id: payload.id,
        },
      });

      if (updatedRows === 0) {
        return res.status(400).json({
          success: false,
          message: "Scrap Asset not found.",
        });
      }

      const scrap = await Scrap.findByPk(payload.id);

      return res.status(200).json({
        success: true,
        message: "Scrap Asset updated successfully.",
        data: scrap,
      });
    }

    const createScrap = await Scrap.create(payload);

    await Asset.update(
      {
        status: "Scrapped",
      },
      {
        where: {
          id: payload.assetId,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Asset scrapped successfully.",
      data: createScrap,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const scrapGetList = async (req, res) => {
  try {
    const scrapList = await Scrap.findAndCountAll({
      include: [
        {
          model: Asset,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Scrap list fetched successfully",
      totalRecords: scrapList.count,
      data: scrapList.rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const scrapViewById = async (req, res) => {
  try {
    const scrapView = await Scrap.findByPk(req.params.id, {
      include: [{ model: Asset }],
    });

    if (!scrapView) {
      return res.status(400).json({
        success: false,
        message: "Scrap not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scrap detail fetched successfully",
      data: scrapView,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const scrapListPage = (req, res) => {
  res.render("scrap/list");
};

const scrapAddPage = (req, res) => {
  res.render("scrap/add");
};

const scrapViewPage = (req, res) => {
  res.render("scrap/view", {
    id: req.params.id,
  });
};

const scrapEditPage = (req, res) => {
  res.render("scrap/edit", {
    id: req.params.id,
  });
};

module.exports = {
  createOrUpdateScrap,
  scrapGetList,
  scrapViewById,
  scrapListPage,
  scrapAddPage,
  scrapViewPage,
  scrapEditPage,
};
