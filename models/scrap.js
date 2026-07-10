const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Asset = require("./asset");

const ScrapAsset = sequelize.define(
  "ScrapAsset",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    scrapDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "scrapAssets",
    timestamps: true,
  },
);

ScrapAsset.belongsTo(Asset, {
  foreignKey: "assetId",
});

Asset.hasOne(ScrapAsset, {
  foreignKey: "assetId",
});

module.exports = ScrapAsset;
