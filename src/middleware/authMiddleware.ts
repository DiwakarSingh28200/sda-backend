import { NextFunction, Request, Response } from "express";
import { db } from "../config/db";

export interface AuthRequest extends Request {
  user: {
    id: string;
    name: string;
    email: string;
    department_id: string;
  };
}
export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No token provided." });
    }

    // Verify JWT token using Supabase Auth API
    const { data, error } = await db.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token." });
    }

    // Fetch employee details from `employees` table using auth_uid
    const { data: employee, error: empError } = await db
      .from("employees")
      .select("id, first_name, last_name, email, department_id")
      .eq("auth_uid", data.user.id)
      .single();

    if (empError || !employee) {
      return res.status(403).json({ error: "Employee record not found." });
    }

    req.user = {
      id: employee.id,
      name: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      department_id: employee.department_id,
    };

    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed." });
  }
};
