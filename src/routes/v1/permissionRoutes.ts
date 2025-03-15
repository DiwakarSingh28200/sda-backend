import express from "express";
import {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionById,
} from "../../controllers/permissionController";

import { asyncHandler } from "../../middleware/asyncHandler";

const router = express.Router();

// Get all permissions
router.get("/", asyncHandler(getAllPermissions));

// Get permission by ID
router.get("/:id", asyncHandler(getPermissionById));

// Create a new permission
router.post("/", asyncHandler(createPermission));

// Update an existing permission
router.put("/:id", asyncHandler(updatePermission));

// Delete a permission
router.delete("/:id", asyncHandler(deletePermission));

export default router;
