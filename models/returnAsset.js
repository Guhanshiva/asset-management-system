const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const IssueAsset = require("./issueAsset");

const ReturnAsset = sequelize.define(
  "ReturnAsset",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    issueAssetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    reason: {
      type: DataTypes.ENUM("Upgrade", "Repair", "Resignation", "Other"),
      allowNull: false,
    },
  },
  {
    tableName: "returnAssets",
    timestamps: true,
  },
);

ReturnAsset.belongsTo(IssueAsset, {
  foreignKey: "issueAssetId",
});

IssueAsset.hasOne(ReturnAsset, {
  foreignKey: "issueAssetId",
});

module.exports = ReturnAsset;
