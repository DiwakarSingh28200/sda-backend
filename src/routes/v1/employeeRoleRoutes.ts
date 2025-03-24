import express from "express";
import {
  assignRoleToEmployee,
  getEmployeeRoles,
  removeRoleFromEmployee,
  assignEmployeeRoles
} from "../../controllers/employeeRoleController";

import { asyncHandler } from "../../middleware/asyncHandler";
import { authenticateEmployee } from "../../middleware/authMeddleware";

const router = express.Router();

// Get all roles assigned to an employee
router.get("/:employeeId", asyncHandler(getEmployeeRoles));

// Assign a role to an employee
router.post("/", asyncHandler(authenticateEmployee), asyncHandler(assignEmployeeRoles));

// Remove a role from an employee
router.delete("/:employeeId/:roleId", asyncHandler(removeRoleFromEmployee));

export default router;
