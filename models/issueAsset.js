const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Employee = require("./employee");
const Asset = require("./asset");

const IssueAsset = sequelize.define(
  "IssueAsset",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Issued", "Returned"),
      defaultValue: "Issued",
    },
  },
  {
    tableName: "issueAssets",
    timestamps: true,
  },
);

// Associations
IssueAsset.belongsTo(Employee, {
  foreignKey: "employeeId",
});

Employee.hasMany(IssueAsset, {
  foreignKey: "employeeId",
});

IssueAsset.belongsTo(Asset, {
  foreignKey: "assetId",
});

Asset.hasMany(IssueAsset, {
  foreignKey: "assetId",
});

module.exports = IssueAsset;
