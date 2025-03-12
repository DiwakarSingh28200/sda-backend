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
export const authorizePermission = (requiredPermissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      // Step 1: Fetch all role IDs assigned to the user
      const { data: userRoles, error: roleError } = await db
        .from("user_roles")
        .select("role_id")
        .eq("user_id", userId);

      if (roleError || !userRoles || userRoles.length === 0) {
        return res.status(403).json({ error: "Access denied. No roles assigned." });
      }

      // Extract role IDs
      const roleIds = userRoles.map((role) => role.role_id);

      // Step 2: Fetch permission IDs linked to those roles (role_permissions table)
      const { data: rolePermissions, error: permError } = await db
        .from("role_permissions")
        .select("permission_id")
        .in("role_id", roleIds); // ✅ Corrected query, no innerJoin needed

      if (permError || !rolePermissions || rolePermissions.length === 0) {
        return res.status(403).json({ error: "Access denied. No permissions assigned." });
      }

      // Extract permission IDs
      const permissionIds = rolePermissions.map((rp) => rp.permission_id);

      // Step 3: Fetch actual permissions from the `permissions` table
      const { data: permissions, error: finalError } = await db
        .from("permissions")
        .select("name")
        .in("id", permissionIds);

      if (finalError || !permissions || permissions.length === 0) {
        return res.status(403).json({ error: "Access denied. No valid permissions found." });
      }

      // Extract permission names
      const userPermissions = permissions.map((p) => p.name);

      // Step 4: Check if user has at least one required permission
      const hasAccess = requiredPermissions.some((perm) => userPermissions.includes(perm));

      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied. Insufficient permissions." });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  };
};
