import { Request, Response } from "express";
import { db } from "../config/db";
import { ApiResponse } from "../types/apiResponse";

// ✅ Get all employees
export const getAllEmployees = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { data: employees, error } = await db
      .from("employees")
      .select("id, employee_id, first_name, last_name, email, phone, dob, gender, status, department:department_id(id, name), created_by(id, first_name, last_name), created_at");

    if (error) {
      return res.status(400).json({ success: false, message: "Error fetching employees." });
    }

    return res.json({ success: true, message: "Employees retrieved successfully.", data: employees });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error instanceof Error ? error.message : "Unknown error"  });
  }
};

// ✅ Get employee by ID
export const getEmployeeById = async (req: Request, res: Response<ApiResponse<any>>): Promise<Response> => {
  try {
    const { id } = req.params;

    const { data: employee, error } = await db
      .from("employees")
      .select("id, employee_id, first_name, last_name, email, phone, dob, gender, status, department:department_id(id, name), created_by(id, first_name, last_name), created_at, updated_at")
      .eq("id", id)
      .single();

    if (error || !employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    return res.json({ success: true, message: "Employee retrieved successfully.", data: employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error.", error: error instanceof Error ? error.message : "Unknown error" });
  }
};
