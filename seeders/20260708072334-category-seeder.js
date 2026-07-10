"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("assetCategories", [
      {
        id: "11111111-1111-1111-1111-111111111111",
        categoryName: "Laptop",
        description: "Company Laptops",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        categoryName: "Desktop",
        description: "Desktop Computers",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        categoryName: "Mobile Phone",
        description: "Company Mobiles",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "44444444-4444-4444-4444-444444444444",
        categoryName: "Monitor",
        description: "LED Monitors",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "55555555-5555-5555-5555-555555555555",
        categoryName: "Printer",
        description: "Office Printers",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "66666666-6666-6666-6666-666666666666",
        categoryName: "Scanner",
        description: "Document Scanners",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "77777777-7777-7777-7777-777777777777",
        categoryName: "Projector",
        description: "Projectors",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "88888888-8888-8888-8888-888888888888",
        categoryName: "Keyboard",
        description: "USB Keyboards",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "99999999-9999-9999-9999-999999999999",
        categoryName: "Mouse",
        description: "USB Mouse",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        categoryName: "Drill Machine",
        description: "Power Drill",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        categoryName: "Screw Driver",
        description: "Tool Kit",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("assetCategories", null, {});
  },
};
