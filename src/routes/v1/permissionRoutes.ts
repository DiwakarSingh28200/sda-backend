import express from "express"
import {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionById,
} from "../../controllers/permissionController"

import { asyncHandler } from "../../middleware/asyncHandler"
import { authenticateEmployee } from "../../middleware/authMeddleware"

const router = express.Router()

// Get all permissions
router.get("/", asyncHandler(getAllPermissions))

// Get permission by ID
router.get("/:id", asyncHandler(getPermissionById))

// Create a new permission
router.post("/", asyncHandler(authenticateEmployee), asyncHandler(createPermission))

// Update an existing permission
router.put("/:id", asyncHandler(authenticateEmployee), asyncHandler(updatePermission))

// Delete a permission
router.delete("/:id", asyncHandler(authenticateEmployee), asyncHandler(deletePermission))

export default router
