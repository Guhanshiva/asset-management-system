"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("assets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      assetCode: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      serialNumber: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      assetName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "assetCategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      make: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      model: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      branch: {
        type: Sequelize.ENUM("Chennai", "Bangalore", "Hyderabad"),
        allowNull: false,
      },

      purchasePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("In Stock", "Issued", "Repair", "Scrapped"),
        allowNull: false,
        defaultValue: "In Stock",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("assets");

    // Remove PostgreSQL ENUM type
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_assets_status";',
    );
  },
};
