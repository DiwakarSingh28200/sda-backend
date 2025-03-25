import express from "express"
import {
  getDepartments,
  getDepartmentById,
  updateDepartment,
  addRoleToDepartment,
  removeRoleFromDepartment,
  getDepartmentsWithRoles,
  addDepartment,
  deleteDepartment,
} from "../../controllers/departmentController"

import { asyncHandler } from "../../middleware/asyncHandler"
import { authenticateEmployee } from "../../middleware/authMeddleware"

const router = express.Router()

// Get all departments
router.get("/", asyncHandler(getDepartments))

// Add a department
router.post("/", asyncHandler(authenticateEmployee), asyncHandler(addDepartment))

// ✅ Get all departments with assigned roles
router.get("/with-roles", asyncHandler(getDepartmentsWithRoles))

// Get a department by ID (with roles)
router.get("/:id", asyncHandler(getDepartmentById))

// Update department details
router.put("/:id", asyncHandler(authenticateEmployee), asyncHandler(updateDepartment))

// Delete Department
router.delete("/:id", asyncHandler(authenticateEmployee), asyncHandler(deleteDepartment))

// Add a role to a department
router.post("/:id/roles", asyncHandler(addRoleToDepartment))

// Remove a role from a department
router.delete("/:id/roles/:roleId", asyncHandler(removeRoleFromDepartment))

export default router
