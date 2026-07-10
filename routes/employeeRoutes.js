const express = require("express");
const router = express.Router();

const {
  createOrUpdateEmployee,
  getEmployeeList,
  employeeListPage,
  addEmployeePage,
  viewEmployeeById,
  viewEmployeePage,
  editEmployeePage,
} = require("../controller/employeeController");

router.post("/create", createOrUpdateEmployee);
router.post("/getList", getEmployeeList);
router.get("/detail/:id", viewEmployeeById);

// View
router.get("/", employeeListPage);
router.get("/add", addEmployeePage);
router.get("/view/:id", viewEmployeePage);
router.get("/edit/:id", editEmployeePage);

module.exports = router;
