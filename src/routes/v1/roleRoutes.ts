import express from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  
} from "../../controllers/roleController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { assignMultiplePermissionsToRole } from "../../controllers/rolePermissionController";
import { authenticateEmployee } from "../../middleware/authMeddleware";

const router = express.Router();

// ✅ Get all roles
router.get("/", asyncHandler(getAllRoles));

// ✅ Get role by ID
router.get("/:id", asyncHandler(getRoleById));

// ✅ Create a new role
router.post("/", asyncHandler(createRole));

// ✅ Update an existing role
router.put("/:id", asyncHandler(updateRole));

// ✅ Delete a role
router.delete("/:id", asyncHandler(deleteRole));

// ✅ Get roles with permissions
// router.get("/with-permissions", asyncHandler(getRolesWithPermissions));

// Assign multiple permissions to a role
router.post("/:roleId/permissions", asyncHandler(authenticateEmployee), asyncHandler(assignMultiplePermissionsToRole));


export default router;
