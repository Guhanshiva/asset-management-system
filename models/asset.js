const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const AssetCategory = require("../models/assetCategory");

const Asset = sequelize.define(
  "Asset",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    assetCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    assetName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    branch: {
      type: DataTypes.ENUM("Coimbatore", "Chennai", "Bangalore"),
      allowNull: false,
    },

    purchasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("In Stock", "Issued", "Repair", "Scrapped"),
      defaultValue: "In Stock",
    },
  },
  {
    tableName: "assets",
    timestamps: true,
  },
);
Asset.belongsTo(AssetCategory, {
  foreignKey: "categoryId",
});

AssetCategory.hasMany(Asset, {
  foreignKey: "categoryId",
});
module.exports = Asset;
