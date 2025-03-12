import { Request, Response } from "express";
import { db } from "../config/db";
import { AuthRequest } from "../types/auth"; // Import custom request type

// Get all departments
export const getDepartments = async (req: Request, res: Response): Promise<Response> => {
  const { data: departments, error } = await db.from("departments").select("id, name, description");

  if (error) {
    return res.status(500).json({ error: "Failed to fetch departments." });
  }

  return res.json({ departments });
};

// Get a single department by ID (with roles)
export const getDepartmentById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  // Fetch department details
  const { data: department, error: deptError } = await db.from("departments").select("id, name, description").eq("id", id).single();

  if (deptError || !department) {
    return res.status(404).json({ error: "Department not found." });
  }

  // Fetch roles assigned to this department
  const { data: roles, error: roleError } = await db.from("roles").select("id, role, role_name, description").eq("department_id", id);

  if (roleError) {
    return res.status(500).json({ error: "Failed to fetch roles." });
  }

  return res.json({ department, roles });
};

// Update department details
export const updateDepartment = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, description } = req.body;
  const user = (req as AuthRequest).user; // ✅ Type Casting Fix

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required." });
  }

  const { error } = await db.from("departments").update({ name, description }).eq("id", id);

  if (error) {
    return res.status(500).json({ error: "Failed to update department." });
  }

  return res.json({ message: "Department updated successfully." });
};

// Add a role to a department
export const addRoleToDepartment = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { role, role_name, description } = req.body;
  const user = (req as AuthRequest).user; 

  console.log('id: ', id);
  console.log('User: ', user);

  if (!role || !role_name || !description) {
    return res.status(400).json({ error: "Role name and description are required." });
  }

  const { error } = await db.from("roles").insert({ role, role_name, description, department_id: id, created_by: 'f3be3c6a-99a6-43e4-b48e-011b3f44d054' });

  if (error) {
    return res.status(500).json({ error: "Failed to add role.", err: error.message });
  }

  return res.json({ message: "Role added successfully." });
};

// ✅ Remove a role from a department
export const removeRoleFromDepartment = async (req: Request, res: Response): Promise<Response> => {
  const { id, roleId } = req.params;

  const { error } = await db.from("roles").delete().eq("id", roleId).eq("department_id", id);

  if (error) {
    return res.status(500).json({ error: "Failed to remove role.", message: error.message });
  }

  return res.json({ message: "Role removed successfully." });
};


// Get all departments with assigned roles
export const getDepartmentsWithRoles = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Fetch all departments
    const { data: departments, error: deptError } = await db
      .from("departments")
      .select("id, name, description");

    if (deptError || !departments) {
      return res.status(500).json({ error: "Failed to fetch departments." });
    }

    // Fetch roles assigned to each department
    const { data: roles, error: roleError } = await db
      .from("roles")
      .select("id, role, role_name, description, department_id");

    if (roleError || !roles) {
      return res.status(500).json({ error: "Failed to fetch roles." });
    }

    // Map roles to their respective departments
    const departmentsWithRoles = departments.map(department => ({
      ...department,
      roles: roles.filter(role => role.department_id === department.id) 
    }));

    return res.json({ departments: departmentsWithRoles });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
