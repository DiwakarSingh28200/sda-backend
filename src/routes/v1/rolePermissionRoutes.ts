import express from "express";
import {
  getPermissionsByRole,
  assignPermissionToRole,
  removePermissionFromRole,
} from "../../controllers/rolePermissionController";

import { asyncHandler } from "../../middleware/asyncHandler";

const router = express.Router();

// Get all permissions assigned to a role
router.get("/:roleId",  asyncHandler(getPermissionsByRole));

// Assign a permission to a role
router.post("/",  asyncHandler(assignPermissionToRole));

// Remove a permission from a role
router.delete("/:roleId/:permissionId", asyncHandler(removePermissionFromRole));


export default router;
