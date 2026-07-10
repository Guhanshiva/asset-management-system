const { AssetCategory } = require("../models");
const { Validator } = require("node-input-validator");
const { Op } = require("sequelize");

const createOrUpdateCategory = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      categoryName: "required|string",
      description: "required|string",
      status: "required|in:Active,Inactive",
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
    const categoryNameWhere = {
      categoryName: payload.categoryName,
    };

    if (payload.id) {
      categoryNameWhere.id = {
        [Op.ne]: payload.id,
      };
    }

    const exitcategoryNameWhere = await AssetCategory.findOne({
      where: categoryNameWhere,
    });

    if (exitcategoryNameWhere) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists.",
      });
    }

    // Update employee
    if (payload.id) {
      const [updatedRows] = await AssetCategory.update(payload, {
        where: { id: payload.id },
      });

      if (updatedRows === 0) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }

      const category = await AssetCategory.findByPk(payload.id);

      return res.status(200).json({
        success: true,
        message: "Asset category updated successfully",
        data: category,
      });
    }

    const createCategory = await AssetCategory.create(payload);

    return res.status(200).json({
      success: true,
      message: "Asset category created successfully",
      data: createCategory,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getCategoryList = async (req, res) => {
  try {
    const where = {};

    if (req.body?.status) {
      where.status = req.body.status;
    }
    const categoryList = await AssetCategory.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      message: "Category list feteched successfully",
      totalRecords: categoryList.count,
      data: categoryList.rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const viewCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await AssetCategory.findByPk(id);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category details fetched successfully",
      data: category,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const categoryListPage = (req, res) => {
  res.render("category/list");
};

const categoryAddPage = (req, res) => {
  res.render("category/add");
};

const categoryViewPage = (req, res) => {
  res.render("category/view", {
    id: req.params.id,
  });
};

const categoryEditPage = (req, res) => {
  res.render("category/edit", {
    id: req.params.id,
  });
};

module.exports = {
  createOrUpdateCategory,
  getCategoryList,
  viewCategoryById,
  categoryListPage,
  categoryAddPage,
  categoryViewPage,
  categoryEditPage,
};
