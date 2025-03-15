import { Request, Response } from "express";
import { db } from "../config/db";
import { AuthRequest } from "../types/auth";
import { ApiResponse } from "../types/apiResponse";

// Get all permissions assigned to a role
export const getPermissionsByRole = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { roleId } = req.params;

    const { data: permissions, error } = await db
      .from("role_permissions")
      .select(`
        id, 
        permission_id, 
        permissions(id, name, description, category)
      `)
      .eq("role_id", roleId);

    if (error || !permissions) {
      return res.status(500).json({ success: false, message: "Failed to fetch role permissions.", error: error.message });
    }

    
    return res.json({ success: true, message: "Role permissions retrieved successfully.", data: permissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

// Assign a permission to a role
export const assignPermissionToRole = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { role_id, permission_id } = req.body;
    const user = (req as AuthRequest).user;

    if (!role_id || !permission_id) {
      return res.status(400).json({ success: false, message: "Role ID and Permission ID are required." });
    }

    const { error } = await db
      .from("role_permissions")
      .insert({ role_id, permission_id, assigned_by: user.id });

    if (error) {
      return res.status(500).json({ success: false, message: "Failed to assign permission.", error: error.message });
    }

    return res.json({ success: true, message: "Permission assigned successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

// Remove a permission from a role
export const removePermissionFromRole = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { roleId, permissionId } = req.params;

    const { error } = await db
      .from("role_permissions")
      .delete()
      .eq("role_id", roleId)
      .eq("permission_id", permissionId);

    if (error) {
      return res.status(500).json({ success: false, message: "Failed to remove permission.", error: error.message });
    }

    return res.json({ success: true, message: "Permission removed successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};
