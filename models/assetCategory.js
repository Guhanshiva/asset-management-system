const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const AssetCategory = sequelize.define(
  "AssetCategory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "assetCategories",
    timestamps: true,
  },
);

module.exports = AssetCategory;
