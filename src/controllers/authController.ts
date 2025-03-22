import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { ApiResponse } from "../types/apiResponse";

export const loginEmployee = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    // console.log("Login request received:", req.body);

    const { employee_id, password } = req.body;

    // Step 1: Fetch Employee Using `employee_id`
    const { data: employee, error: employeeError } = await db
      .from("employees")
      .select("id, employee_id, first_name, last_name, password, department:department_id(id, name)")
      .eq("employee_id", employee_id)
      .single();

    // console.log("Employee Fetch Result:", employee, employeeError);

    if (employeeError) {
      // console.error("❌ Supabase Employee Query Error:", employeeError);
      return res.status(500).json({ success: false, message: "Database error fetching employee.", error: employeeError.message });
    }

    if (!employee) {
      // console.warn("❌ No employee found with this ID.");
      return res.status(401).json({ success: false, message: "Invalid Employee ID or password." });
    }

    // Step 2: Verify Password
    // console.log("Checking password for:", employee.employee_id);
    if (!employee.password) {
      // console.error(`❌ Employee ${employee.employee_id} has no password set.`);
      return res.status(400).json({ success: false, message: "Employee password not set. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    // console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Employee ID or password." });
    }

    // Step 3: Fetch Employee Roles
    // console.log("Fetching roles for:", employee.id);
    const { data: roles, error: rolesError } = await db
      .from("employee_roles")
      .select("role_id, roles(role, role_name)")
      .eq("employee_id", employee.id);

    // console.log("Roles Fetch Result:", roles, rolesError);

    if (rolesError) {
      // console.error("❌ Supabase Roles Query Error:", rolesError);
      return res.status(500).json({ success: false, message: "Database error fetching roles.", error: rolesError.message });
    }

    if (!roles || roles.length === 0) {
      // console.warn("❌ No roles assigned for employee.");
      return res.status(403).json({ success: false, message: "No roles assigned. Contact admin." });
    }

    const roleIds = roles.map((r: any) => r.role_id);
    const roleNames = roles.map((r: any) => r.roles.role_name);

    // Step 4: Fetch Permissions Based on Roles
    // console.log("Fetching permissions for roles:", roleIds);
    const { data: permissions, error: permissionsError } = await db
      .from("role_permissions")
      .select("permission_id, permissions(name)")
      .in("role_id", roleIds);

    // console.log("Permissions Fetch Result:", permissions, permissionsError);

    if (permissionsError) {
      // console.error("❌ Supabase Permissions Query Error:", permissionsError);
      return res.status(500).json({ success: false, message: "Database error fetching permissions.", error: permissionsError.message });
    }

    const permissionNames = permissions.map((p: any) => p.permissions.name);

    // Step 5: Generate JWT Token
    // console.log("🔹 Generating JWT token for:", employee.employee_id);
    const token = jwt.sign(
      {
        id: employee.id,
        roles: roleNames,
        permissions: permissionNames,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    // console.log("✅ JWT Token Generated Successfully.");

    // Step 6: Set Cookie & Send Response
    return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN,
      maxAge: 30 * 24 * 60 * 60 * 1000, 
  
    }).json({
        success: true,
        message: "Login successful.",
        data: {
          employee: {
            id: employee.id,
            employee_id: employee.employee_id,
            name: `${employee.first_name} ${employee.last_name}`,
            department: employee.department,
          },
          roles: roleNames,
          permissions: permissionNames,
        },
      });

  } catch (error: any) {
    
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || JSON.stringify(error),
    });
  }
};


// Get all employees
export const getAllEmployees = async (req: Request, res: Response<any>): Promise<any> => {
  try {
    const { data: employees, error: employeesError } = await db.from("employees").select("*");  
    if (employeesError) {
      return res.status(500).json({ success: false, message: "Internal server error.", error: employeesError?.message });
    }
    return res.status(200).json({ success: true, message: "Employees fetched successfully.", data: employees });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

export const getLoggedInUser = async (req: Request<any>, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const user = req.user; 

    // Step 1: Fetch Employee Using `employee_id
    const { data: employee, error: employeeError } = await db
      .from("employees")
      .select("id, employee_id, first_name, last_name, department:department_id(id, name)")
      .eq("id", user?.id!)
      .single();


    if (employeeError || !employee) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

      // Step 2: Fetch Employee Roles (Using `id`, NOT `employee_id`)
      const { data: roles, error: rolesError } = await db
      .from("employee_roles")
      .select("role_id, roles(role, role_name)")
      .eq("employee_id", employee.id)
  
  
      if (rolesError || !roles.length) {
        return res.status(403).json({ success: false, message: "No roles assigned. Contact admin.", error: rolesError?.message, data: roles });
      }

 
      const roleIds = roles.map((r:any) => r.role_id);
      const roleNames = roles.map((r:any) => r.roles.role_name);
      
      // Step 4: Fetch Permissions Based on Roles (Using `role_id`)
      const { data: permissions, error: permissionsError } = await db
      .from("role_permissions")
      .select("permission_id, permissions(name)")
      .in("role_id", roleIds);
      
      // return res.status(200).json({ success: true, message: "Roles fetched successfully.", data: permissions });
      
      if (permissionsError) {
        return res.status(500).json({ success: false, message: "Error fetching permissions.", error: permissionsError?.message });
      }
  
      const permissionNames = permissions.map((p: any) => p.permissions.name);

  
    return res.json({
      success: true,
      message: "Employee retrieved successfully.",
      data: {
        employee: {
          id: employee.id,
          employee_id: employee.employee_id,
          name: `${employee.first_name} ${employee.last_name}`,
          department: employee.department,
        },
        roles: roleNames,
        permissions: permissionNames,
      },
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};

export const logoutEmployee = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    res.clearCookie("access_token");
    return res.status(200).json({ success: true, message: "Logout successful." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error as string });
  }
};