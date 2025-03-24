import { Request, Response } from "express";
import { db } from "../config/db";
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
    const user = req.user;

    if (!role_id || !permission_id) {
      return res.status(400).json({ success: false, message: "Role ID and Permission ID are required." });
    }

    const { error } = await db
      .from("role_permissions")
      .insert({ role_id, permission_id, assigned_by: user?.id! });

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


// Assign multiple permissions to a role
export const assignMultiplePermissionsToRole = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { roleId } = req.params;
    const { permissions_ids } = req.body;
    const requested_employee_id = req.user?.id!;

   if (!roleId || !Array.isArray(permissions_ids) || permissions_ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Role ID and at least one Permission ID are required.",
      data: {
        roleId,
        permissions:permissions_ids,
        requested: req.user,
      },
    });
   }
   

    // check if employee role is admin
    const { data: employee, error: employeeError } = await db
      .from("employees")
      .select("role_id")
      .eq("id", requested_employee_id)
      .single(); 

    if (employeeError) {
      return res.status(500).json({ success: false, message: "Failed to fetch employee role.", error: employeeError.message, data: {
        id:requested_employee_id,
        roleId,
        permissions_ids,
      } });
    }

    // permission id for super admin
    const super_admin_permission_id = "bce571e6-af85-4dcd-8609-cd479493a177";

    // check inside the role_permissions table if the employee has the super_admin_permission_id
    const { data: role_permission, error: role_permission_error } = await db
      .from("role_permissions")
      .select("id")
      .eq("role_id", employee?.role_id!)
      .eq("permission_id", super_admin_permission_id);

    if (role_permission_error) {
      return res.status(500).json({ success: false, message: "Failed to check if employee has super admin permission.", error: role_permission_error.message });
    }
    
    if (role_permission?.length === 0) {
      return res.status(403).json({ success: false, message: "You are not authorized to assign permissions." });
    }
      

    
    if (!roleId || !Array.isArray(permissions_ids) || permissions_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Role ID and at least one Permission ID are required.",
      });
    }

    const inserts = permissions_ids.map((permissions_id) => ({
      role_id: roleId,
      permission_id: permissions_id,
      assigned_by: requested_employee_id,
    }));

    const { error } = await db
      .from("role_permissions")
      .insert(inserts);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to assign permissions.",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Permissions assigned successfully.",
      data: { inserted: inserts.length },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error as string,
    });
  }
};
