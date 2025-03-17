import { Request, Response } from "express";
import { db } from "../config/db";
import { ApiResponse } from "../types/apiResponse";

// ✅ Get all roles assigned to an employee
export const getEmployeeRoles = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { employeeId } = req.params;

    const { data: roles, error } = await db
      .from("employee_roles")
      .select(`
        id, 
        role_id, 
        roles(id, role, role_name, description)
      `)
      .eq("employee_id", employeeId)

    if (error || !roles) {
      return res.status(500).json({ success: false, message: "Failed to fetch employee roles.", error: error.message });
    }

    return res.json({ success: true, message: "Employee roles retrieved successfully.", data: roles });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

// Assign a role to an employee
export const assignRoleToEmployee = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { employee_id, role_id } = req.body;
    const user = req.user;

    if (!employee_id || !role_id) {
      return res.status(400).json({ success: false, message: "Employee ID and Role ID are required." });
    }

    const { error } = await db
      .from("employee_roles")
      .insert({ employee_id, role_id, assigned_by: user?.id! }); // hardcoded for now

    if (error) {
      return res.status(500).json({ success: false, message: "Failed to assign role.", error: error.message });
    }

    return res.json({ success: true, message: "Role assigned successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

// ✅ Remove a role from an employee
export const removeRoleFromEmployee = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { employeeId, roleId } = req.params;

    console.log(employeeId, roleId);

    // check if the employee has the role
    const { data: employeeRole, error: employeeRoleError } = await db
      .from("employee_roles")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("role_id", roleId);

    if (employeeRoleError) {
      return res.status(500).json({ success: false, message: "Failed to check if employee has role.", error: employeeRoleError.message });
    }

    if (!employeeRole) {
      return res.status(400).json({ success: false, message: "Employee does not have this role." });
    }

    // only admins can remove roles from employees


    const { error } = await db
      .from("employee_roles")
      .delete()
      .eq("employee_id", employeeId)
      .eq("role_id", roleId);

    if (error) {
      return res.status(500).json({ success: false, message: "Failed to remove role.", error: error.message });
    }

    return res.json({ success: true, message: "Role removed successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};
