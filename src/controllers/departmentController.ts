import { Request, Response } from "express";
import { db } from "../config/db";
import { AuthRequest } from "../types/auth"; // Import custom request type
import { ApiResponse } from "../types/apiResponse";

// Get all departments
export const getDepartments = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  const { data: departments, error } = await db.from("departments").select("id, name, description, created_by(id, first_name, last_name)");

  if (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch departments.", error: error.message });
  }

  return res.json({ success: true, message: "Departments fetched successfully.", data: departments });
};

// Get a single department by ID (with roles)
export const getDepartmentById = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  const { id } = req.params;

  // Fetch department details
  const { data: department, error: deptError } = await db.from("departments").select("id, name, description").eq("id", id).single();

  if (deptError || !department) {
    return res.status(404).json({ success: false, message: "Department not found.", error: deptError?.message });
  }

  // Fetch roles assigned to this department
  const { data: roles, error: roleError } = await db.from("roles").select("id, role, role_name, description").eq("department_id", id);

  if (roleError) {
    return res.status(500).json({ success: false, message: "Failed to fetch roles.", error: roleError.message });
  }

  return res.json({ success: true, message: "Department fetched successfully.", data: { department, roles } });
};

// Update department details
export const updateDepartment = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  const { id } = req.params;
  const { name, description } = req.body;
  const user = (req as AuthRequest).user; // ✅ Type Casting Fix

  if (!name || !description) {
    return res.status(400).json({ success: false, message: "Name and description are required." });
  }

  const { error } = await db.from("departments").update({ name, description }).eq("id", id);

  if (error) {
    return res.status(500).json({ success: false, message: "Failed to update department.", error: error.message });
  }

  return res.json({ success: true, message: "Department updated successfully." });
};

// Add a role to a department
export const addRoleToDepartment = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  const { id } = req.params;
  const { role, role_name, description } = req.body;
  const user = (req as AuthRequest).user; 



  if (!role || !role_name || !description) {
    return res.status(400).json({ success: false, message: "Role name and description are required." });
  }

  const { error } = await db.from("roles").insert({ role, role_name, description, department_id: id, created_by: 'f3be3c6a-99a6-43e4-b48e-011b3f44d054' });

  if (error) {
    return res.status(500).json({ success: false, message: "Failed to add role.", error: error.message });
  }

  return res.json({ success: true, message: "Role added successfully." });
};

// ✅ Remove a role from a department
export const removeRoleFromDepartment = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  const { id, roleId } = req.params;

  const { error } = await db.from("roles").delete().eq("id", roleId).eq("department_id", id);

  if (error) {
    return res.status(500).json({ success: false, message: "Failed to remove role.", error: error.message });
  }

  return res.json({ success: true, message: "Role removed successfully." });
};


// Get all departments with assigned roles
export const getDepartmentsWithRoles = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    // Fetch all departments
    const { data: departments, error: deptError } = await db
      .from("departments")
      .select("id, name, description");

    if (deptError || !departments) {
      return res.status(500).json({ success: false, message: "Failed to fetch departments.", error: deptError?.message });
    }

    // Fetch roles assigned to each department
    const { data: roles, error: roleError } = await db
      .from("roles")
      .select("id, role, role_name, description, department_id");

    if (roleError || !roles) {
      return res.status(500).json({ success: false, message: "Failed to fetch roles.", error: roleError?.message });
    }

    // Remove department_id from roles
    const transformedRoles = roles.map(({ department_id, ...rest }) => rest);

    // Map roles to their respective departments
    const departmentsWithRoles = departments.map(department => ({
      ...department,
      roles: transformedRoles 
    }));

    return res.json({ success: true, message: "Departments with roles fetched successfully.", data: departmentsWithRoles });
  } catch (error) {
    console.error("Error fetching departments with roles:", error);
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};
