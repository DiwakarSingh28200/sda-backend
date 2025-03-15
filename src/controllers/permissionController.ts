import { Request, Response } from "express";
import { db } from "../config/db";
import { AuthRequest } from "../types/auth"; 
import { ApiResponse } from "../types/apiResponse"; 

// ✅ Get all permissions
export const getAllPermissions = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { data: permissions, error } = await db
      .from("permissions")
      .select("id, name, description, category, created_by:created_by(id, first_name, last_name)");
      

    if (error || !permissions) {
      return res.status(500).json({ success: false, message: "Failed to fetch permissions.", error: error.message });
    }
   

    return res.json({ success: true, message: "Permissions retrieved successfully.", data: permissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

// ✅ Get a specific permission by ID
export const getPermissionById = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { id } = req.params;

    const { data: permission, error } = await db
      .from("permissions")
      .select(`
        id, 
        name, 
        description, 
        category, 
        created_by:created_by(id, first_name, last_name)
      `)
      .eq("id", id)
      .single();

    if (error || !permission) {
      return res.status(404).json({ success: false, message: "Permission not found." });
    }

    return res.json({ success: true, message: "Permission retrieved successfully.", data: permission });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

// Create a new permission
export const createPermission = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { name, description, category } = req.body;
    // const user = (req as AuthRequest).user; 

    if (!name || !description || !category) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const { error } = await db
      .from("permissions")
      .insert({ name, description, category, created_by: 'f3be3c6a-99a6-43e4-b48e-011b3f44d054' });

    if (error) {
      return res.status(500).json({ success: false, message: "Failed to create permission.", error: error.message });
    }

    return res.json({ success: true, message: "Permission created successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

// ✅ Update an existing permission
export const updatePermission = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Add role base validation only admin can update the permissions
    // We need to get the role of the user and check if the user has the permission to update the permission
    // If the user has the permission to update the permission, then we can update the permission
    // If the user does not have the permission to update the permission, then we return a 403 error
    // We need to get the role of the user from the database
    // We need to get the permissions of the role from the database
    // We need to check if the user has the permission to update the permission
    

    const { error } = await db
      .from("permissions")
      .update({ name, description, category })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ success: false, message: "Failed to update permission.", error: error.message });
    }

    return res.json({ success: true, message: "Permission updated successfully." });
  } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

// Delete a permission
export const deletePermission = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { id } = req.params;

    // Add role base validation only admin can delete the permissions
    // We need to get the role of the user and check if the user has the permission to delete the permission
    // If the user has the permission to delete the permission, then we can delete the permission
    // If the user does not have the permission to delete the permission, then we return a 403 error
    // We need to get the role of the user from the database
    // We need to get the permissions of the role from the database
    // We need to check if the user has the permission to delete the permission
    
    const { error } = await db
      .from("permissions")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ success: false, message: "Failed to delete permission.", error: error.message });
    }

    return res.json({ success: true, message: "Permission deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};
