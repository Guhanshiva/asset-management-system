const { Employee } = require("../models");
const { Validator } = require("node-input-validator");
const { Op } = require("sequelize");

const createOrUpdateEmployee = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      empCode: "required|string",
      name: "required|string",
      email: "required|email",
      department: "required|string",
      designation: "required|string",
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
    const empCodeWhere = {
      empCode: payload.empCode,
    };

    const emailWhere = {
      email: payload.email,
    };

    if (payload.id) {
      empCodeWhere.id = {
        [Op.ne]: payload.id,
      };

      emailWhere.id = {
        [Op.ne]: payload.id,
      };
    }

    const exitEmpCode = await Employee.findOne({
      where: empCodeWhere,
    });

    if (exitEmpCode) {
      return res.status(400).json({
        success: false,
        message: "Employee code already exists.",
      });
    }

    const exitEmail = await Employee.findOne({
      where: emailWhere,
    });

    if (exitEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Update employee
    if (payload.id) {
      const [updatedRows] = await Employee.update(payload, {
        where: { id: payload.id },
      });

      if (updatedRows === 0) {
        return res.status(400).json({
          success: false,
          message: "Employee not found",
        });
      }

      const employee = await Employee.findByPk(payload.id);

      return res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: employee,
      });
    }

    // Create employee
    const createUser = await Employee.create(payload);

    return res.status(200).json({
      success: true,
      message: "Employee created successfully",
      data: createUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getEmployeeList = async (req, res) => {
  try {
    // const page = Number(req.body?.page) || 1;
    // const limit = Number(req.body?.limit) || 10;
    // const offset = (page - 1) * limit;

    const where = {};

    if (req.body?.status) {
      where.status = req.body.status;
    }
    const employeeList = await Employee.findAndCountAll({
      where,
      //   limit,
      //   offset,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      message: "Employee list feteched successfully",
      totalRecords: employeeList.count,
      //   currentPage: page,
      data: employeeList.rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const viewEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee details fetched successfully",
      data: employee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Render Pug page
const employeeListPage = (req, res) => {
  res.render("employee/list");
};

const addEmployeePage = (req, res) => {
  res.render("employee/add");
};

const viewEmployeePage = (req, res) => {
  res.render("employee/view", {
    id: req.params.id,
  });
};

const editEmployeePage = (req, res) => {
  res.render("employee/edit", {
    id: req.params.id,
  });
};

module.exports = {
  createOrUpdateEmployee,
  getEmployeeList,
  viewEmployeeById,
  employeeListPage,
  addEmployeePage,
  viewEmployeePage,
  editEmployeePage,
};
