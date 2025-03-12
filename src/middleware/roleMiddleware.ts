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
export const authorizeRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      // Step 1: Fetch all role IDs assigned to the user from `user_roles` table
      const { data: userRoles, error: roleError } = await db
        .from("user_roles")
        .select("role_id")
        .eq("user_id", userId);

      if (roleError || !userRoles || userRoles.length === 0) {
        return res.status(403).json({ error: "Access denied. No roles assigned." });
      }

      // Extract role IDs
      const roleIds = userRoles.map((role) => role.role_id);

      // Step 2: Fetch role names from the `roles` table
      const { data: roles, error: roleFetchError } = await db
        .from("roles")
        .select("role")
        .in("id", roleIds); 

      if (roleFetchError || !roles || roles.length === 0) {
        return res.status(403).json({ error: "Access denied. No valid roles found." });
      }

      // Extract role names
      const userRolesNames = roles.map((r) => r.role);

      // Step 3: Check if user has at least one required role
      const hasAccess = allowedRoles.some((role) => userRolesNames.includes(role));

      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied. Insufficient role permissions." });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  };
};
