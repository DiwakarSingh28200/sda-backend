import express from "express";
import {
  getDepartments,
  getDepartmentById,
  updateDepartment,
  addRoleToDepartment,
  removeRoleFromDepartment,
  getDepartmentsWithRoles,
} from "../../controllers/departmentController";
import { authenticateUser } from "../../middleware/authMiddleware";
import { authorizePermission } from "../../middleware/permissionMiddleware";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = express.Router();

// Get all departments
router.get("/", asyncHandler(getDepartments));

// ✅ Get all departments with assigned roles
router.get("/with-roles", asyncHandler(getDepartmentsWithRoles));


// Get a department by ID (with roles)
router.get("/:id", asyncHandler(getDepartmentById));

// Update department details
router.put("/:id", asyncHandler(updateDepartment));

// Add a role to a department
router.post("/:id/roles", asyncHandler(addRoleToDepartment));

// Remove a role from a department
router.delete("/:id/roles/:roleId", asyncHandler(removeRoleFromDepartment));

export default router;
