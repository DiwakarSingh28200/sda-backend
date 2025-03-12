import { Request, Response } from "express";
import { db } from "../config/db";
import { AuthRequest } from "../types/auth"; // Import custom request type

// Get all roles
export const getAllRoles = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: roles, error } = await db
      .from("roles")
      .select(`
    id, 
    role, 
    role_name, 
    description,
    departments(id,name), 
    employees(id,first_name, last_name)
  `)


    if (error || !roles) {
      return res.status(500).json({ error: "Failed to fetch roles.", message: error.message });
    }


    return res.json({ roles});
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Get a specific role by ID
export const getRoleById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const { data: role, error } = await db
      .from("roles")
      .select(`id, 
    role, 
    role_name, 
    description, 
    departments(id,name),  
    employees(id,first_name, last_name)`)
      .eq("id", id)
      .single();

    if (error || !role) {
      return res.status(404).json({ error: "Role not found." });
    }

    return res.json({ role });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Create a new role
export const createRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { role, role_name, description, department_id } = req.body;
    const user = (req as AuthRequest).user; 

    console.log('Body: ', req.body);

    if (!role || !role_name || !description || !department_id) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const { error } = await db
      .from("roles")
      .insert({ role, role_name, description, department_id, created_by: 'f3be3c6a-99a6-43e4-b48e-011b3f44d054' });

    if (error) {
      return res.status(500).json({ error: "Failed to create role." });
    }

    return res.json({ message: "Role created successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Update an existing role
export const updateRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { role, role_name, description, department_id } = req.body;

    if (!role || !role_name || !description || !department_id) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const { error } = await db
      .from("roles")
      .update({ role, role_name, description, department_id })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Failed to update role." });
    }

    return res.json({ message: "Role updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Delete a role
export const deleteRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const { error } = await db
      .from("roles")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Failed to delete role." });
    }

    return res.json({ message: "Role deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
